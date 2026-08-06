"""Exceptions for the AI Retrieval module."""

from __future__ import annotations


class RetrievalError(Exception):
    """Base exception for retrieval errors."""


class RetrievalNotFoundError(RetrievalError):
    """Raised when no retrieval results are found."""


class InvalidRetrievalRequestError(RetrievalError):
    """Raised when a retrieval request is invalid."""


class UnsupportedRetrievalProviderError(RetrievalError):
    """Raised when an unsupported retrieval provider is requested."""


class HybridRetrievalError(RetrievalError):
    """Raised when hybrid retrieval fails."""
