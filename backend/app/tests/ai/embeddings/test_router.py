"""Tests for the AI Embeddings router."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.ai.embeddings.constants import (
    EmbeddingProvider,
    EmbeddingSourceType,
    EmbeddingStatus,
)
from app.ai.embeddings.models import Embedding
from app.models.organization import Organization
from app.models.user import User


def create_embedding(
    db_session: Session,
    organization: Organization,
    user: User,
) -> Embedding:
    """Create an embedding for router tests."""
    embedding = Embedding(
        organization_id=organization.id,
        knowledge_id=None,
        provider=EmbeddingProvider.OPENAI,
        model="text-embedding-3-small",
        source_type=EmbeddingSourceType.DOCUMENT,
        source_id=uuid4(),
        content="Sample embedding",
        dimensions=1536,
        vector=[0.1, 0.2, 0.3],
        metadata_json={},
        status=EmbeddingStatus.READY,
        created_by=user.id,
        updated_by=user.id,
    )

    db_session.add(embedding)
    db_session.commit()
    db_session.refresh(embedding)

    return embedding


def test_create_embedding(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test creating an embedding."""
    payload = {
        "provider": "openai",
        "model": "text-embedding-3-small",
        "source_type": "document",
        "source_id": str(uuid4()),
        "content": "Hello World",
        "metadata": {},
    }

    response = client.post(
        "/api/v1/embeddings",
        headers=auth_headers,
        json=payload,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["content"] == "Hello World"
    assert data["provider"] == "openai"
    assert data["model"] == "text-embedding-3-small"


def test_get_embedding(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Test retrieving an embedding."""
    embedding = create_embedding(
        db_session,
        organization,
        user,
    )

    response = client.get(
        f"/api/v1/embeddings/{embedding.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == str(embedding.id)
    assert data["content"] == "Sample embedding"


def test_get_embedding_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test retrieving a missing embedding."""
    response = client.get(
        f"/api/v1/embeddings/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_list_embeddings(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Test listing embeddings."""
    create_embedding(
        db_session,
        organization,
        user,
    )

    create_embedding(
        db_session,
        organization,
        user,
    )

    response = client.get(
        "/api/v1/embeddings",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["items"]) == 2
    assert data["total"] == 2
    assert data["offset"] == 0
    assert data["limit"] == 100


def test_update_embedding(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Test updating an embedding."""
    embedding = create_embedding(
        db_session,
        organization,
        user,
    )

    payload = {
        "content": "Updated embedding",
        "status": "ready",
    }

    response = client.patch(
        f"/api/v1/embeddings/{embedding.id}",
        headers=auth_headers,
        json=payload,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["content"] == "Updated embedding"
    assert data["status"] == "ready"


def test_delete_embedding(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Test deleting an embedding."""
    embedding = create_embedding(
        db_session,
        organization,
        user,
    )

    embedding_id = embedding.id

    response = client.delete(
        f"/api/v1/embeddings/{embedding_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204
    assert response.content == b""

    db_session.expire_all()

    deleted = db_session.get(
        Embedding,
        embedding_id,
    )

    assert deleted is None


def test_delete_embedding_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test deleting a missing embedding."""
    response = client.delete(
        f"/api/v1/embeddings/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404
