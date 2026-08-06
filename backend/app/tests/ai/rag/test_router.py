"""Tests for the AI RAG router."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.ai.rag.constants import DEFAULT_PROVIDER
from app.ai.rag.exceptions import UnsupportedLLMProviderError


def test_generate(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Generate endpoint should return a successful response."""
    response = client.post(
        "/api/v1/ai/rag/generate",
        headers=auth_headers,
        json={
            "query": "What is Retrieval-Augmented Generation?",
            "provider": DEFAULT_PROVIDER,
            "top_k": 5,
            "temperature": 0.2,
            "max_tokens": 512,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["provider"] == DEFAULT_PROVIDER
    assert "answer" in data
    assert "citations" in data
    assert "usage" in data


def test_providers(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Providers endpoint should return supported providers."""
    response = client.get(
        "/api/v1/ai/rag/providers",
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
    """Statistics endpoint should return RAG statistics."""
    response = client.get(
        "/api/v1/ai/rag/statistics",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["provider"] == DEFAULT_PROVIDER
    assert "total_requests" in data
    assert "total_generations" in data


def test_requires_authentication(
    client: TestClient,
) -> None:
    """Endpoints should require authentication."""
    response = client.get(
        "/api/v1/ai/rag/providers",
    )

    assert response.status_code == 401


def test_invalid_request_returns_validation_error(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Invalid request should return a validation error."""
    response = client.post(
        "/api/v1/ai/rag/generate",
        headers=auth_headers,
        json={},
    )

    assert response.status_code == 422


def test_invalid_provider_returns_error(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Unsupported provider should raise an exception."""
    with pytest.raises(UnsupportedLLMProviderError):
        client.post(
            "/api/v1/ai/rag/generate",
            headers=auth_headers,
            json={
                "query": "Hello",
                "provider": "invalid-provider",
            },
        )


def test_generate_returns_success(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Generate endpoint should return a valid response."""
    response = client.post(
        "/api/v1/ai/rag/generate",
        headers=auth_headers,
        json={
            "query": "Explain semantic search.",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["provider"] == DEFAULT_PROVIDER
    assert isinstance(
        body["answer"],
        str,
    )
