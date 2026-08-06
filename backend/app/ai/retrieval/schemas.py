"""Schemas for the AI Retrieval module."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.ai.retrieval.constants import (
    DEFAULT_LIMIT,
    DEFAULT_PROVIDER,
    DEFAULT_SCORE_THRESHOLD,
    DEFAULT_TOP_K,
    MAX_LIMIT,
    MAX_TOP_K,
)


class RetrievalRequest(BaseModel):
    """Request for semantic retrieval."""

    model_config = ConfigDict(extra="forbid")

    query: str = Field(min_length=1)
    provider: str = Field(default=DEFAULT_PROVIDER)
    top_k: int = Field(
        default=DEFAULT_TOP_K,
        ge=1,
        le=MAX_TOP_K,
    )
    score_threshold: float = Field(
        default=DEFAULT_SCORE_THRESHOLD,
        ge=0.0,
        le=1.0,
    )


class HybridRetrievalRequest(RetrievalRequest):
    """Request for hybrid retrieval."""

    keyword_weight: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
    )

    semantic_weight: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
    )


class MetadataSearchRequest(BaseModel):
    """Request for metadata search."""

    model_config = ConfigDict(extra="forbid")

    metadata: dict[str, Any] = Field(default_factory=dict)

    limit: int = Field(
        default=DEFAULT_LIMIT,
        ge=1,
        le=MAX_LIMIT,
    )


class RetrievedDocumentResponse(BaseModel):
    """Retrieved document."""

    id: str

    content: str

    score: float

    metadata: dict[str, Any] = Field(default_factory=dict)


class RetrievalResponse(BaseModel):
    """Retrieval response."""

    provider: str

    documents: list[RetrievedDocumentResponse]

    total_documents: int


class ProviderResponse(BaseModel):
    """Retrieval provider."""

    name: str

    available: bool


class ProviderListResponse(BaseModel):
    """Supported retrieval providers."""

    providers: list[ProviderResponse]


class RetrievalStatisticsResponse(BaseModel):
    """Retrieval statistics."""

    provider: str

    total_documents: int

    indexed_documents: int
