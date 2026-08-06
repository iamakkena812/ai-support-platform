"""Schemas for the AI Ingestion module."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class IngestionCreateRequest(BaseModel):
    """Create ingestion job request."""

    organization_id: UUID
    document_id: UUID
    file_type: str
    chunk_size: int = Field(default=1000, ge=1)
    chunk_overlap: int = Field(default=200, ge=0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class IngestionUpdateRequest(BaseModel):
    """Update ingestion job request."""

    status: str | None = None
    chunks_created: int | None = None
    embeddings_created: int | None = None
    error_message: str | None = None
    metadata: dict[str, Any] | None = None


class IngestionResponse(BaseModel):
    """Ingestion job response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID
    document_id: UUID
    status: str
    file_type: str
    chunk_size: int
    chunk_overlap: int
    chunks_created: int
    embeddings_created: int
    error_message: str | None
    metadata: dict[str, Any]
    started_at: datetime | None
    completed_at: datetime | None
    created_by: UUID | None
    updated_by: UUID | None
    created_at: datetime
    updated_at: datetime


class IngestionListResponse(BaseModel):
    """Paginated ingestion jobs."""

    items: list[IngestionResponse]
    total: int
    page: int
    page_size: int


class IngestionStatisticsResponse(BaseModel):
    """Ingestion statistics."""

    total_jobs: int
    completed_jobs: int
    processing_jobs: int
    failed_jobs: int
