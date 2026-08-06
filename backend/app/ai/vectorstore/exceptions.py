"""Exceptions for the AI Vector Store module."""

from __future__ import annotations


class VectorStoreError(Exception):
    """Base exception for all Vector Store errors."""


class ProviderUnavailableError(VectorStoreError):
    """Raised when the requested vector provider is unavailable."""


class UnsupportedProviderError(VectorStoreError):
    """Raised when an unsupported vector provider is requested."""


class InvalidSearchRequestError(VectorStoreError):
    """Raised when a search request is invalid."""


class InvalidEmbeddingError(VectorStoreError):
    """Raised when an embedding is invalid or malformed."""


class EmbeddingNotFoundError(VectorStoreError):
    """Raised when the requested embedding cannot be found."""


class SimilaritySearchError(VectorStoreError):
    """Raised when similarity search fails."""


class HybridSearchError(VectorStoreError):
    """Raised when hybrid search fails."""


class VectorStoreOperationError(VectorStoreError):
    """Raised when a vector store operation fails."""


class StatisticsError(VectorStoreError):
    """Raised when statistics cannot be generated."""
