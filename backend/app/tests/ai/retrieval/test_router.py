"""Tests for the AI Retrieval router."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.ai.embeddings.models import Embedding
from app.ai.retrieval.constants import DEFAULT_PROVIDER
from app.auth.password import hash_password
from app.models.organization import Organization
from app.models.user import User


def _other_org_headers(
    client: TestClient,
    db_session: Session,
) -> tuple[User, dict[str, str]]:
    """Create a second organization/user and return their auth headers."""
    unique = uuid4().hex[:8]

    other_organization = Organization(
        name=f"Other Retrieval Org {unique}",
        code=f"OTHERRET-{unique}",
        email=f"{unique}@other-retrieval.com",
        phone="+919999999994",
        website="https://other-retrieval.com",
        logo_url="https://other-retrieval.com/logo.png",
        address="1 Other Retrieval Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500006",
        timezone="Asia/Kolkata",
        is_active=True,
    )
    db_session.add(other_organization)
    db_session.commit()
    db_session.refresh(other_organization)

    other_user = User(
        organization_id=other_organization.id,
        email=f"{unique}@other-retrieval.com",
        username=f"user{unique}",
        full_name="Other Org User",
        password_hash=hash_password("Password123!"),
        is_active=True,
    )
    db_session.add(other_user)
    db_session.commit()
    db_session.refresh(other_user)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": other_user.email, "password": "Password123!"},
    )
    assert response.status_code == 200

    token = response.json()["access_token"]

    return other_user, {"Authorization": f"Bearer {token}"}


def test_retrieve(
    client: TestClient,
    auth_headers: dict[str, str],
    embedding: Embedding,
) -> None:
    """Retrieve endpoint should return relevant, real, persisted documents."""
    response = client.post(
        "/api/v1/ai/retrieval/retrieve",
        headers=auth_headers,
        json={
            "query": "Test",
            "provider": DEFAULT_PROVIDER,
            "top_k": 5,
            "score_threshold": 0.0,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["provider"] == DEFAULT_PROVIDER
    assert data["total_documents"] == 1
    assert data["documents"][0]["id"] == str(embedding.id)
    assert data["documents"][0]["score"] > 0.0


def test_retrieve_query_affects_results(
    client: TestClient,
    auth_headers: dict[str, str],
    embedding: Embedding,
) -> None:
    """A query with no relevant terms should return no results."""
    response = client.post(
        "/api/v1/ai/retrieval/retrieve",
        headers=auth_headers,
        json={
            "query": "completely-unrelated-term",
            "provider": DEFAULT_PROVIDER,
            "top_k": 5,
            "score_threshold": 0.0,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["documents"] == []
    assert data["total_documents"] == 0


def test_retrieve_is_isolated_across_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    embedding: Embedding,
) -> None:
    """A user must never retrieve another organization's embeddings."""
    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.post(
        "/api/v1/ai/retrieval/retrieve",
        headers=other_headers,
        json={
            "query": "Test",
            "provider": DEFAULT_PROVIDER,
            "top_k": 5,
            "score_threshold": 0.0,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["documents"] == []
    assert data["total_documents"] == 0


def test_hybrid(
    client: TestClient,
    auth_headers: dict[str, str],
    embedding: Embedding,
) -> None:
    """Hybrid endpoint should return relevant documents."""
    response = client.post(
        "/api/v1/ai/retrieval/hybrid",
        headers=auth_headers,
        json={
            "query": "Test",
            "provider": DEFAULT_PROVIDER,
            "top_k": 5,
            "score_threshold": 0.0,
            "keyword_weight": 0.5,
            "semantic_weight": 0.5,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["provider"] == DEFAULT_PROVIDER
    assert "documents" in data
    assert data["documents"][0]["score"] <= 0.5


def test_hybrid_is_isolated_across_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    embedding: Embedding,
) -> None:
    """Hybrid retrieval must never return another organization's embeddings."""
    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.post(
        "/api/v1/ai/retrieval/hybrid",
        headers=other_headers,
        json={
            "query": "Test",
            "provider": DEFAULT_PROVIDER,
            "top_k": 5,
            "score_threshold": 0.0,
        },
    )

    assert response.status_code == 200
    assert response.json()["documents"] == []


def test_metadata_search(
    client: TestClient,
    auth_headers: dict[str, str],
    embedding: Embedding,
) -> None:
    """Metadata search endpoint should return relevant documents."""
    response = client.post(
        "/api/v1/ai/retrieval/metadata-search",
        headers=auth_headers,
        json={
            "metadata": embedding.metadata_json,
            "limit": 10,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "documents" in data
    assert "total_documents" in data
    assert data["total_documents"] == 1


def test_metadata_search_is_isolated_across_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    embedding: Embedding,
) -> None:
    """Metadata search must never return another organization's embeddings."""
    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.post(
        "/api/v1/ai/retrieval/metadata-search",
        headers=other_headers,
        json={
            "metadata": embedding.metadata_json,
            "limit": 10,
        },
    )

    assert response.status_code == 200
    assert response.json()["documents"] == []


def test_providers(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Providers endpoint should return supported providers."""
    response = client.get(
        "/api/v1/ai/retrieval/providers",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["providers"]) == 1
    assert data["providers"][0]["name"] == DEFAULT_PROVIDER


def test_statistics(
    client: TestClient,
    auth_headers: dict[str, str],
    embedding: Embedding,
) -> None:
    """Statistics endpoint should return retrieval statistics."""
    response = client.get(
        "/api/v1/ai/retrieval/statistics",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["provider"] == DEFAULT_PROVIDER
    assert data["total_documents"] == 1
    assert data["indexed_documents"] == 1


def test_statistics_is_isolated_across_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    embedding: Embedding,
) -> None:
    """Statistics must not count another organization's embeddings."""
    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        "/api/v1/ai/retrieval/statistics",
        headers=other_headers,
    )

    assert response.status_code == 200
    assert response.json()["total_documents"] == 0


def test_requires_authentication(
    client: TestClient,
) -> None:
    """Endpoints should require authentication."""
    response = client.get(
        "/api/v1/ai/retrieval/providers",
    )

    assert response.status_code == 401


def test_retrieve_requires_authentication(
    client: TestClient,
) -> None:
    """Retrieve endpoint should require authentication."""
    response = client.post(
        "/api/v1/ai/retrieval/retrieve",
        json={"query": "Test"},
    )

    assert response.status_code == 401


def test_invalid_request_returns_validation_error(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Invalid request should return a validation error."""
    response = client.post(
        "/api/v1/ai/retrieval/retrieve",
        headers=auth_headers,
        json={},
    )

    assert response.status_code == 422


def test_invalid_provider_returns_error(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Unsupported provider should return an error."""
    response = client.post(
        "/api/v1/ai/retrieval/retrieve",
        headers=auth_headers,
        json={
            "query": "Hello",
            "provider": "invalid-provider",
        },
    )

    assert response.status_code == 400


def test_hybrid_invalid_provider_returns_error(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Hybrid endpoint should reject unsupported providers."""
    response = client.post(
        "/api/v1/ai/retrieval/hybrid",
        headers=auth_headers,
        json={
            "query": "Hello",
            "provider": "invalid-provider",
        },
    )

    assert response.status_code == 400


def test_metadata_search_validation(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Metadata search should validate request payload."""
    response = client.post(
        "/api/v1/ai/retrieval/metadata-search",
        headers=auth_headers,
        json={
            "limit": 0,
        },
    )

    assert response.status_code == 422
