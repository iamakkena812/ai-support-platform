"""Exceptions for the AI RAG module."""

from __future__ import annotations


class RAGError(Exception):
    """Base exception for the AI RAG module."""


class ContextRetrievalError(RAGError):
    """Raised when context retrieval fails."""


class PromptConstructionError(RAGError):
    """Raised when prompt construction fails."""


class GenerationError(RAGError):
    """Raised when LLM generation fails."""


class UnsupportedLLMProviderError(RAGError):
    """Raised when an unsupported LLM provider is requested."""
