"""Pydantic schemas for the attachments module."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AttachmentBase(BaseModel):
    """Base schema for attachments."""

    description: str | None = Field(
        default=None,
        max_length=1000,
    )


class AttachmentCreate(AttachmentBase):
    """Schema for creating an attachment."""

    filename: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    original_filename: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    content_type: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    extension: str = Field(
        ...,
        min_length=1,
        max_length=20,
    )

    file_size: int = Field(
        ...,
        gt=0,
    )

    storage_provider: str = Field(
        default="local",
        max_length=50,
    )

    storage_key: str = Field(
        ...,
        min_length=1,
        max_length=512,
    )

    storage_path: str = Field(
        ...,
        min_length=1,
        max_length=1024,
    )

    checksum: str = Field(
        ...,
        min_length=1,
        max_length=128,
    )

    ticket_id: UUID | None = None
    comment_id: UUID | None = None


class AttachmentUpdate(BaseModel):
    """Schema for updating an attachment."""

    description: str | None = Field(
        default=None,
        max_length=1000,
    )


class AttachmentRead(AttachmentBase):
    """Schema returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID

    organization_id: UUID

    ticket_id: UUID | None

    comment_id: UUID | None

    uploaded_by_id: UUID

    filename: str

    original_filename: str

    content_type: str

    extension: str

    file_size: int

    storage_provider: str

    storage_key: str

    storage_path: str

    checksum: str

    is_deleted: bool

    created_at: datetime

    updated_at: datetime


class AttachmentList(BaseModel):
    """List response for attachments."""

    items: list[AttachmentRead]

    total: int


class AttachmentUploadResponse(BaseModel):
    """Response returned after a successful upload."""

    attachment: AttachmentRead

    message: str = "Attachment uploaded successfully."


class AttachmentDeleteResponse(BaseModel):
    """Response returned after deleting an attachment."""

    message: str = "Attachment deleted successfully."
