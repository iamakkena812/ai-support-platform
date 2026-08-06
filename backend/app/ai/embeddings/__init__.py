"""AI Embeddings module."""

from __future__ import annotations

from app.ai.embeddings.constants import (
    DEFAULT_EMBEDDING_DIMENSIONS,
    DEFAULT_EMBEDDING_MODEL,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    EmbeddingProvider,
    EmbeddingSourceType,
    EmbeddingStatus,
)
from app.ai.embeddings.dependencies import (
    get_embedding_repository,
    get_embedding_service,
)
from app.ai.embeddings.exceptions import (
    EmbeddingAlreadyExistsError,
    EmbeddingError,
    EmbeddingNotFoundError,
    EmbeddingValidationError,
)
from app.ai.embeddings.models import Embedding
from app.ai.embeddings.repository import AIEmbeddingRepository
from app.ai.embeddings.router import router
from app.ai.embeddings.schemas import (
    EmbeddingCreate,
    EmbeddingListResponse,
    EmbeddingResponse,
    EmbeddingUpdate,
)
from app.ai.embeddings.service import AIEmbeddingService

__all__ = [
    "AIEmbeddingRepository",
    "AIEmbeddingService",
    "DEFAULT_EMBEDDING_DIMENSIONS",
    "DEFAULT_EMBEDDING_MODEL",
    "DEFAULT_PAGE_SIZE",
    "Embedding",
    "EmbeddingAlreadyExistsError",
    "EmbeddingCreate",
    "EmbeddingError",
    "EmbeddingListResponse",
    "EmbeddingNotFoundError",
    "EmbeddingProvider",
    "EmbeddingResponse",
    "EmbeddingSourceType",
    "EmbeddingStatus",
    "EmbeddingUpdate",
    "EmbeddingValidationError",
    "MAX_PAGE_SIZE",
    "get_embedding_repository",
    "get_embedding_service",
    "router",
]
