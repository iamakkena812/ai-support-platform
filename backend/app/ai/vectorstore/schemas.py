"""Schemas for the AI Vector Store module."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.ai.vectorstore.constants import (
    DEFAULT_PROVIDER,
    DEFAULT_SIMILARITY_THRESHOLD,
    DEFAULT_TOP_K,
)


class SemanticSearchRequest(BaseModel):
    """Request schema for semantic search."""

    query: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Natural language search query.",
    )
    provider: str = Field(
        default=DEFAULT_PROVIDER,
        description="Vector provider to use.",
    )
    top_k: int = Field(
        default=DEFAULT_TOP_K,
        ge=1,
        le=100,
        description="Maximum number of search results.",
    )
    similarity_threshold: float = Field(
        default=DEFAULT_SIMILARITY_THRESHOLD,
        ge=0.0,
        le=1.0,
        description="Minimum similarity score.",
    )


class SimilarEmbeddingsRequest(BaseModel):
    """Request schema for similar embeddings search."""

    embedding_id: UUID
    provider: str = Field(default=DEFAULT_PROVIDER)
    top_k: int = Field(
        default=DEFAULT_TOP_K,
        ge=1,
        le=100,
    )


class HybridSearchRequest(BaseModel):
    """Request schema for hybrid search."""

    query: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )
    keyword: str | None = Field(
        default=None,
        max_length=255,
    )
    provider: str = Field(default=DEFAULT_PROVIDER)
    top_k: int = Field(
        default=DEFAULT_TOP_K,
        ge=1,
        le=100,
    )
    similarity_threshold: float = Field(
        default=DEFAULT_SIMILARITY_THRESHOLD,
        ge=0.0,
        le=1.0,
    )


class VectorSearchResult(BaseModel):
    """Single vector search result."""

    model_config = ConfigDict(from_attributes=True)

    embedding_id: UUID
    knowledge_id: UUID | None = None
    source_type: str
    source_id: UUID
    similarity_score: float
    metadata: dict[str, Any] = Field(default_factory=dict)


class VectorSearchResponse(BaseModel):
    """Semantic or hybrid search response."""

    model_config = ConfigDict(from_attributes=True)

    provider: str
    total_results: int
    results: list[VectorSearchResult]


class ProviderResponse(BaseModel):
    """Vector provider information."""

    name: str
    display_name: str
    supports_semantic_search: bool
    supports_similarity_search: bool
    supports_hybrid_search: bool
    supports_metadata_filtering: bool
    supports_updates: bool
    supports_deletion: bool
    available: bool


class ProviderListResponse(BaseModel):
    """Response containing available providers."""

    providers: list[ProviderResponse]


class VectorStoreStatisticsResponse(BaseModel):
    """Vector Store statistics."""

    provider: str
    total_embeddings: int
    total_sources: int
    total_knowledge_items: int


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str
