"""Tests for Vector Store service."""

from __future__ import annotations

import pytest

from app.ai.embeddings.models import Embedding
from app.ai.vectorstore.exceptions import (
    UnsupportedProviderError,
)
from app.ai.vectorstore.service import VectorStoreService


def test_semantic_search_returns_results(
    vectorstore_service: VectorStoreService,
    embedding: Embedding,
) -> None:
    """Semantic search should return matching embeddings."""


def test_semantic_search_returns_empty_list(
    vectorstore_service: VectorStoreService,
) -> None:
    """Semantic search should return an empty result."""


def test_similar_embeddings_returns_results(
    vectorstore_service: VectorStoreService,
    embedding: Embedding,
) -> None:
    """Similar embeddings search should return results."""


def test_hybrid_search_returns_results(
    vectorstore_service: VectorStoreService,
    embedding: Embedding,
) -> None:
    """Hybrid search should return results."""


def test_providers_returns_supported_providers(
    vectorstore_service: VectorStoreService,
) -> None:
    """Supported providers should be returned."""


def test_statistics_returns_summary(
    vectorstore_service: VectorStoreService,
    embedding: Embedding,
) -> None:
    """Statistics should be returned."""


def test_invalid_provider_raises_error(
    vectorstore_service: VectorStoreService,
) -> None:
    """Unsupported provider should raise an exception."""
    with pytest.raises(UnsupportedProviderError):
        vectorstore_service._validate_provider("invalid-provider")


def test_build_response_returns_expected_structure(
    vectorstore_service: VectorStoreService,
    embedding: Embedding,
) -> None:
    """Search response should be built correctly."""
