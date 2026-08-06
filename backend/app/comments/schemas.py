"""Comment schemas."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.comments.constants import (
    MAX_COMMENT_LENGTH,
    MIN_COMMENT_LENGTH,
    CommentVisibility,
)


class CreateCommentRequest(BaseModel):
    """Request schema for creating a comment."""

    content: str = Field(
        ...,
        min_length=MIN_COMMENT_LENGTH,
        max_length=MAX_COMMENT_LENGTH,
    )
    visibility: CommentVisibility = CommentVisibility.INTERNAL


class UpdateCommentRequest(BaseModel):
    """Request schema for updating a comment."""

    content: str | None = Field(
        default=None,
        min_length=MIN_COMMENT_LENGTH,
        max_length=MAX_COMMENT_LENGTH,
    )
    visibility: CommentVisibility | None = None


class CommentResponse(BaseModel):
    """Comment response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    ticket_id: UUID
    organization_id: UUID
    author_id: UUID

    content: str
    visibility: CommentVisibility

    is_internal: bool
    is_edited: bool
    is_deleted: bool

    created_at: datetime
    updated_at: datetime


class CommentListResponse(BaseModel):
    """Paginated comment list response."""

    items: list[CommentResponse]
    total: int
