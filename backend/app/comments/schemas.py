"""Comment schemas."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import Field

from app.comments.constants import MAX_COMMENT_LENGTH, MIN_COMMENT_LENGTH
from app.comments.models import Comment
from app.core.schemas import CamelModel


class CreateCommentRequest(CamelModel):
    """Request schema for creating a comment."""

    content: str = Field(
        ...,
        min_length=MIN_COMMENT_LENGTH,
        max_length=MAX_COMMENT_LENGTH,
    )
    is_internal: bool = True


class UpdateCommentRequest(CamelModel):
    """Request schema for updating a comment."""

    content: str | None = Field(
        default=None,
        min_length=MIN_COMMENT_LENGTH,
        max_length=MAX_COMMENT_LENGTH,
    )
    is_internal: bool | None = None


class CommentAuthorRef(CamelModel):
    """Comment author reference."""

    id: UUID
    name: str
    email: str


class CommentTicketRef(CamelModel):
    """Parent ticket reference."""

    id: UUID
    title: str


class CommentResponse(CamelModel):
    """Comment response schema."""

    id: UUID
    ticket_id: UUID
    content: str
    is_internal: bool
    is_edited: bool
    author: CommentAuthorRef
    ticket: CommentTicketRef
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_comment(cls, comment: Comment) -> CommentResponse:
        """Build a response from a comment, resolving author/ticket refs."""
        return cls(
            id=comment.id,
            ticket_id=comment.ticket_id,
            content=comment.content,
            is_internal=comment.is_internal,
            is_edited=comment.is_edited,
            author=CommentAuthorRef(
                id=comment.author.id,
                name=comment.author.full_name,
                email=comment.author.email,
            ),
            ticket=CommentTicketRef(
                id=comment.ticket.id,
                title=comment.ticket.title,
            ),
            created_at=comment.created_at,
            updated_at=comment.updated_at,
        )


class CommentListResponse(CamelModel):
    """Paginated comment list response."""

    items: list[CommentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
