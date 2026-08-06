"""Schemas for the file module."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.files.constants import (
    FileCategory,
    FileProvider,
    FileStatus,
)


class FileBase(BaseModel):
    """Base schema for file metadata."""

    filename: str = Field(..., min_length=1, max_length=255)
    content_type: str = Field(..., max_length=255)
    size: int = Field(..., ge=0)
    provider: FileProvider = FileProvider.LOCAL


class FileCreate(BaseModel):
    """Schema for creating a file."""

    filename: str
    original_filename: str
    content: bytes
    content_type: str
    size: int
    checksum: str
    provider: FileProvider
    category: FileCategory


class FileUpdate(BaseModel):
    """Schema used for updating a file."""

    filename: str | None = Field(default=None, min_length=1, max_length=255)
    status: FileStatus | None = None


class FileResponse(FileBase):
    """Schema returned to clients."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    storage_path: str
    checksum: str
    status: FileStatus
    created_at: datetime
    updated_at: datetime


class FileListResponse(BaseModel):
    """Paginated list of files."""

    items: list[FileResponse]
    total: int


class FileSearchParams(BaseModel):
    """Query parameters for searching files."""

    filename: str | None = None
    provider: FileProvider | None = None
    status: FileStatus | None = None
    skip: int = 0
    limit: int = 100
