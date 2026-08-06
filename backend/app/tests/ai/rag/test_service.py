"""Tests for the AI RAG service."""

from __future__ import annotations

import pytest

from app.ai.embeddings.models import Embedding
from app.ai.rag.constants import DEFAULT_PROVIDER
from app.ai.rag.exceptions import UnsupportedLLMProviderError
from app.ai.rag.schemas import RAGRequest
from app.ai.rag.service import RAGService


def test_generate_returns_response(
    rag_service: RAGService,
    embedding: Embedding,
) -> None:
    """Generate should return a RAG response."""
    request = RAGRequest(
        query="What is AI?",
    )

    response = rag_service.generate(request)

    assert response.provider == DEFAULT_PROVIDER
    assert response.answer
    assert response.model
    assert response.usage.total_tokens == 0


def test_generate_returns_empty_citations(
    rag_service: RAGService,
) -> None:
    """Generate should return no citations when no embeddings exist."""
    request = RAGRequest(
        query="What is AI?",
    )

    response = rag_service.generate(request)

    assert response.citations == []


def test_providers_returns_supported_providers(
    rag_service: RAGService,
) -> None:
    """Providers should return supported providers."""
    response = rag_service.providers()

    assert len(response.providers) == 1
    assert response.providers[0].name == DEFAULT_PROVIDER
    assert response.providers[0].available is True


def test_statistics_returns_summary(
    rag_service: RAGService,
    embedding: Embedding,
) -> None:
    """Statistics should return summary information."""
    response = rag_service.statistics()

    assert response.provider == DEFAULT_PROVIDER
    assert response.total_generations == 1


def test_invalid_provider_raises_error(
    rag_service: RAGService,
) -> None:
    """Invalid provider should raise an exception."""
    request = RAGRequest(
        query="Hello",
        provider="invalid",
    )

    with pytest.raises(UnsupportedLLMProviderError):
        rag_service.generate(request)


def test_validate_provider_accepts_default() -> None:
    """Default provider should be accepted."""
    RAGService._validate_provider(DEFAULT_PROVIDER)


def test_build_response_contains_metadata(
    rag_service: RAGService,
    embedding: Embedding,
) -> None:
    """Generated response should contain metadata."""
    request = RAGRequest(
        query="Hello",
    )

    response = rag_service.generate(request)

    assert "retrieved_documents" in response.metadata


def test_generate_uses_requested_top_k(
    rag_service: RAGService,
    embedding: Embedding,
) -> None:
    """Generate should honor the requested top_k."""
    request = RAGRequest(
        query="Hello",
        top_k=1,
    )

    response = rag_service.generate(request)

    assert response.metadata["retrieved_documents"] == 1
