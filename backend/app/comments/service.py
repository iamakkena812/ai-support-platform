"""Comment service."""

from __future__ import annotations

from uuid import UUID

from app.comments.exceptions import CommentNotFoundError
from app.comments.models import Comment
from app.comments.repository import CommentRepository
from app.comments.schemas import (
    CreateCommentRequest,
    UpdateCommentRequest,
)


class CommentService:
    """Service for comment operations."""

    def __init__(
        self,
        repository: CommentRepository,
    ) -> None:
        """Initialize service."""
        self._repository = repository

    def create_comment(
        self,
        *,
        organization_id: UUID,
        author_id: UUID,
        ticket_id: UUID,
        request: CreateCommentRequest,
    ) -> Comment:
        """Create a new comment."""
        comment = Comment(
            organization_id=organization_id,
            author_id=author_id,
            ticket_id=ticket_id,
            content=request.content,
            visibility=request.visibility,
            is_internal=request.visibility == request.visibility.INTERNAL,
            is_edited=False,
            is_deleted=False,
        )

        return self._repository.create(comment)

    def get_comment(
        self,
        comment_id: UUID,
    ) -> Comment:
        """Return a comment by ID."""
        comment = self._repository.get(comment_id)

        if comment is None:
            raise CommentNotFoundError()

        return comment

    def list_comments(
        self,
        *,
        ticket_id: UUID | None = None,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Comment]:
        """Return comments."""
        return self._repository.list(
            ticket_id=ticket_id,
            offset=offset,
            limit=limit,
        )

    def update_comment(
        self,
        comment_id: UUID,
        request: UpdateCommentRequest,
    ) -> Comment:
        """Update a comment."""
        comment = self.get_comment(comment_id)

        update_data = request.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        for field, value in update_data.items():
            setattr(comment, field, value)

        if update_data:
            comment.mark_edited()

        return self._repository.update(comment)

    def delete_comment(
        self,
        comment_id: UUID,
    ) -> None:
        """Delete a comment."""
        comment = self.get_comment(comment_id)
        self._repository.delete(comment)
