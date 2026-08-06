"""Schemas for the AI Documents module."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.ai.documents.constants import (
    DEFAULT_DOCUMENT_VERSION,
    DEFAULT_PAGE_SIZE,
    DEFAULT_STATUS,
    MAX_CONTENT_TYPE_LENGTH,
    MAX_FILENAME_LENGTH,
)


class DocumentCreateRequest(BaseModel):
    """Request to register a document."""

    model_config = ConfigDict(extra="forbid")

    knowledge_id: UUID

    filename: str = Field(
        min_length=1,
        max_length=MAX_FILENAME_LENGTH,
    )

    original_filename: str = Field(
        min_length=1,
        max_length=MAX_FILENAME_LENGTH,
    )

    content_type: str = Field(
        max_length=MAX_CONTENT_TYPE_LENGTH,
    )

    file_size: int = Field(
        ge=0,
    )

    storage_path: str = Field(
        min_length=1,
    )

    checksum: str = Field(
        min_length=1,
    )

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )


class DocumentUpdateRequest(BaseModel):
    """Request to update document metadata."""

    model_config = ConfigDict(extra="forbid")

    filename: str | None = Field(
        default=None,
        max_length=MAX_FILENAME_LENGTH,
    )

    metadata: dict[str, Any] | None = None

    status: str | None = None


class DocumentResponse(BaseModel):
    """Document response."""

    id: UUID

    organization_id: UUID

    knowledge_id: UUID

    filename: str

    original_filename: str

    content_type: str

    file_size: int

    storage_path: str

    checksum: str

    version: int = DEFAULT_DOCUMENT_VERSION

    status: str = DEFAULT_STATUS

    chunk_count: int

    embedding_count: int

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )

    created_at: datetime

    updated_at: datetime


class DocumentListResponse(BaseModel):
    """Paginated document list."""

    documents: list[DocumentResponse]

    total: int

    page: int

    page_size: int = DEFAULT_PAGE_SIZE


class DocumentStatisticsResponse(BaseModel):
    """Document statistics."""

    total_documents: int

    indexed_documents: int

    failed_documents: int

    deleted_documents: int
