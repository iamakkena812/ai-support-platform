"""Tests for the AI Retrieval service."""

from __future__ import annotations

import pytest

from app.ai.embeddings.models import Embedding
from app.ai.retrieval.constants import DEFAULT_PROVIDER
from app.ai.retrieval.exceptions import (
    UnsupportedRetrievalProviderError,
)
from app.ai.retrieval.schemas import (
    HybridRetrievalRequest,
    MetadataSearchRequest,
    RetrievalRequest,
)
from app.ai.retrieval.service import RetrievalService


def test_retrieve_returns_documents(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Retrieve should return matching documents."""
    request = RetrievalRequest(
        query="What is AI?",
    )

    response = retrieval_service.retrieve(request)

    assert response.provider == DEFAULT_PROVIDER
    assert len(response.documents) == 1
    assert response.total_documents == 1


def test_retrieve_returns_empty_documents(
    retrieval_service: RetrievalService,
) -> None:
    """Retrieve should return an empty result."""
    request = RetrievalRequest(
        query="Unknown",
    )

    response = retrieval_service.retrieve(request)

    assert response.documents == []
    assert response.total_documents == 0


def test_hybrid_retrieve_returns_documents(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Hybrid retrieval should return matching documents."""
    request = HybridRetrievalRequest(
        query="AI",
    )

    response = retrieval_service.hybrid_retrieve(request)

    assert len(response.documents) == 1
    assert response.total_documents == 1


def test_metadata_search_returns_documents(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Metadata search should return matching documents."""
    request = MetadataSearchRequest(
        metadata=embedding.metadata_json,
    )

    response = retrieval_service.metadata_search(request)

    assert len(response.documents) == 1
    assert response.total_documents == 1


def test_metadata_search_returns_empty_documents(
    retrieval_service: RetrievalService,
) -> None:
    """Metadata search should return an empty result."""
    request = MetadataSearchRequest(
        metadata={"source": "unknown"},
    )

    response = retrieval_service.metadata_search(request)

    assert response.documents == []
    assert response.total_documents == 0


def test_providers_returns_supported_providers(
    retrieval_service: RetrievalService,
) -> None:
    """Providers should return supported providers."""
    response = retrieval_service.providers()

    assert len(response.providers) == 1
    assert response.providers[0].name == DEFAULT_PROVIDER
    assert response.providers[0].available is True


def test_statistics_returns_summary(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Statistics should return retrieval statistics."""
    response = retrieval_service.statistics()

    assert response.provider == DEFAULT_PROVIDER
    assert response.total_documents == 1
    assert response.indexed_documents == 1


def test_invalid_provider_raises_error(
    retrieval_service: RetrievalService,
) -> None:
    """Unsupported provider should raise an exception."""
    request = RetrievalRequest(
        query="Hello",
        provider="invalid-provider",
    )

    with pytest.raises(
        UnsupportedRetrievalProviderError,
    ):
        retrieval_service.retrieve(request)


def test_validate_provider_accepts_default() -> None:
    """Default provider should be accepted."""
    RetrievalService._validate_provider(
        DEFAULT_PROVIDER,
    )


def test_retrieve_returns_metadata(
    retrieval_service: RetrievalService,
    embedding: Embedding,
) -> None:
    """Retrieved document should include metadata."""
    request = RetrievalRequest(
        query="AI",
    )

    response = retrieval_service.retrieve(request)

    assert response.documents[0].metadata == embedding.metadata_json
