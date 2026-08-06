"""Schemas for the AI RAG module."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.ai.rag.constants import (
    DEFAULT_MAX_TOKENS,
    DEFAULT_PROVIDER,
    DEFAULT_TEMPERATURE,
    DEFAULT_TOP_K,
)


class RAGRequest(BaseModel):
    """Request for RAG generation."""

    model_config = ConfigDict(
        extra="forbid",
    )

    query: str = Field(
        min_length=1,
        max_length=4000,
    )
    provider: str = DEFAULT_PROVIDER
    top_k: int = Field(
        default=DEFAULT_TOP_K,
        ge=1,
        le=20,
    )
    temperature: float = Field(
        default=DEFAULT_TEMPERATURE,
        ge=0.0,
        le=2.0,
    )
    max_tokens: int = Field(
        default=DEFAULT_MAX_TOKENS,
        ge=1,
        le=8192,
    )


class CitationResponse(BaseModel):
    """Citation returned with the generated answer."""

    knowledge_id: UUID | None
    source_id: UUID | None
    source_type: str
    score: float


class UsageResponse(BaseModel):
    """LLM token usage."""

    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class RAGResponse(BaseModel):
    """Response returned from the RAG service."""

    provider: str
    model: str
    answer: str
    citations: list[CitationResponse]
    usage: UsageResponse
    metadata: dict[str, Any] = Field(default_factory=dict)


class ProviderResponse(BaseModel):
    """Supported provider."""

    name: str
    display_name: str
    available: bool


class ProviderListResponse(BaseModel):
    """List of supported providers."""

    providers: list[ProviderResponse]


class RAGStatisticsResponse(BaseModel):
    """RAG statistics."""

    provider: str
    total_requests: int
    total_generations: int
