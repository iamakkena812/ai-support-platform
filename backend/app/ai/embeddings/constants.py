"""Constants for the AI Embeddings module."""

from __future__ import annotations

from enum import StrEnum


class EmbeddingProvider(StrEnum):
    """Supported embedding providers."""

    OPENAI = "openai"
    AZURE_OPENAI = "azure_openai"
    OLLAMA = "ollama"
    SENTENCE_TRANSFORMERS = "sentence_transformers"


class EmbeddingStatus(StrEnum):
    """Embedding generation status."""

    PENDING = "pending"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class EmbeddingSourceType(StrEnum):
    """Embedding source types."""

    KNOWLEDGE = "knowledge"
    CHAT = "chat"
    CONVERSATION = "conversation"
    DOCUMENT = "document"
    TICKET = "ticket"
    COMMENT = "comment"


DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small"
DEFAULT_EMBEDDING_DIMENSIONS = 1536
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
