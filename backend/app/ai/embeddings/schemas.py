"""Schemas for the AI Embeddings module."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.ai.embeddings.constants import (
    EmbeddingProvider,
    EmbeddingSourceType,
    EmbeddingStatus,
)


class EmbeddingCreate(BaseModel):
    """Request schema for creating an embedding."""

    model_config = ConfigDict(
        extra="forbid",
    )

    knowledge_id: UUID | None = None

    provider: EmbeddingProvider = EmbeddingProvider.OPENAI

    model: str = Field(
        min_length=1,
        max_length=255,
    )

    source_type: EmbeddingSourceType

    source_id: UUID

    content: str = Field(
        min_length=1,
    )

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )


class EmbeddingUpdate(BaseModel):
    """Request schema for updating an embedding."""

    model_config = ConfigDict(
        extra="forbid",
    )

    provider: EmbeddingProvider | None = None

    model: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    content: str | None = None

    metadata: dict[str, Any] | None = None

    status: EmbeddingStatus | None = None


class EmbeddingResponse(BaseModel):
    """Response schema for an embedding."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID

    organization_id: UUID

    knowledge_id: UUID | None

    provider: EmbeddingProvider

    model: str

    source_type: EmbeddingSourceType

    source_id: UUID

    content: str

    dimensions: int

    vector: list[float]

    metadata: dict[str, Any]

    status: EmbeddingStatus

    created_by: UUID

    updated_by: UUID

    created_at: datetime

    updated_at: datetime


class EmbeddingListResponse(BaseModel):
    """Paginated embedding list response."""

    items: list[EmbeddingResponse]

    total: int

    offset: int

    limit: int
