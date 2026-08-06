"""Tests for the AI Retrieval router."""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.ai.retrieval.constants import DEFAULT_PROVIDER


def test_retrieve(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Retrieve endpoint should return relevant documents."""
    response = client.post(
        "/api/v1/ai/retrieval/retrieve",
        headers=auth_headers,
        json={
            "query": "What is AI?",
            "provider": DEFAULT_PROVIDER,
            "top_k": 5,
            "score_threshold": 0.75,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["provider"] == DEFAULT_PROVIDER
    assert "documents" in data
    assert "total_documents" in data


def test_hybrid(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Hybrid endpoint should return relevant documents."""
    response = client.post(
        "/api/v1/ai/retrieval/hybrid",
        headers=auth_headers,
        json={
            "query": "What is AI?",
            "provider": DEFAULT_PROVIDER,
            "top_k": 5,
            "keyword_weight": 0.5,
            "semantic_weight": 0.5,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["provider"] == DEFAULT_PROVIDER
    assert "documents" in data


def test_metadata_search(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Metadata search endpoint should return relevant documents."""
    response = client.post(
        "/api/v1/ai/retrieval/metadata-search",
        headers=auth_headers,
        json={
            "metadata": {},
            "limit": 10,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "documents" in data
    assert "total_documents" in data


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
) -> None:
    """Statistics endpoint should return retrieval statistics."""
    response = client.get(
        "/api/v1/ai/retrieval/statistics",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["provider"] == DEFAULT_PROVIDER
    assert "total_documents" in data
    assert "indexed_documents" in data


def test_requires_authentication(
    client: TestClient,
) -> None:
    """Endpoints should require authentication."""
    response = client.get(
        "/api/v1/ai/retrieval/providers",
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
