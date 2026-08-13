"""Pydantic schemas for the attachments module."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import Field

from app.attachments.models import Attachment
from app.core.schemas import CamelModel


class AttachmentUpdate(CamelModel):
    """Schema for updating an attachment."""

    file_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        max_length=1000,
    )


class AttachmentUploaderRef(CamelModel):
    """Uploader reference."""

    id: UUID
    name: str
    email: str


class AttachmentTicketRef(CamelModel):
    """Parent ticket reference."""

    id: UUID
    title: str


class AttachmentRead(CamelModel):
    """Schema returned by the API."""

    id: UUID
    ticket_id: UUID | None
    file_name: str
    original_file_name: str
    content_type: str
    file_size: int
    checksum: str
    description: str | None
    download_url: str
    uploaded_by: AttachmentUploaderRef
    ticket: AttachmentTicketRef | None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_attachment(cls, attachment: Attachment) -> AttachmentRead:
        """Build a response from an attachment, resolving related refs."""
        return cls(
            id=attachment.id,
            ticket_id=attachment.ticket_id,
            file_name=attachment.filename,
            original_file_name=attachment.original_filename,
            content_type=attachment.content_type,
            file_size=attachment.file_size,
            checksum=attachment.checksum,
            description=attachment.description,
            download_url=f"/api/v1/attachments/{attachment.id}/download",
            uploaded_by=AttachmentUploaderRef(
                id=attachment.uploader.id,
                name=attachment.uploader.full_name,
                email=attachment.uploader.email,
            ),
            ticket=(
                AttachmentTicketRef(
                    id=attachment.ticket.id,
                    title=attachment.ticket.title,
                )
                if attachment.ticket is not None
                else None
            ),
            created_at=attachment.created_at,
            updated_at=attachment.updated_at,
        )


class AttachmentListResponse(CamelModel):
    """Paginated attachment list response."""

    items: list[AttachmentRead]
    total: int
    page: int
    page_size: int
    total_pages: int
