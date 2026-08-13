"""Comment service."""

from __future__ import annotations

from uuid import UUID

from app.comments.constants import CommentVisibility
from app.comments.exceptions import (
    CommentNotFoundError,
    CommentPermissionDeniedError,
    CommentTicketNotFoundError,
)
from app.comments.models import Comment
from app.comments.repository import CommentRepository
from app.comments.schemas import (
    CreateCommentRequest,
    UpdateCommentRequest,
)
from app.tickets.repository import TicketRepository


class CommentService:
    """Service for comment operations."""

    def __init__(
        self,
        repository: CommentRepository,
        ticket_repository: TicketRepository,
    ) -> None:
        """Initialize service."""
        self._repository = repository
        self._ticket_repository = ticket_repository

    def create_comment(
        self,
        *,
        organization_id: UUID,
        author_id: UUID,
        ticket_id: UUID,
        request: CreateCommentRequest,
    ) -> Comment:
        """Create a new comment on a ticket within the caller's organization."""
        ticket = self._ticket_repository.get(ticket_id)

        if ticket is None or ticket.organization_id != organization_id:
            raise CommentTicketNotFoundError()

        comment = Comment(
            organization_id=organization_id,
            author_id=author_id,
            ticket_id=ticket_id,
            content=request.content,
            visibility=(
                CommentVisibility.INTERNAL
                if request.is_internal
                else CommentVisibility.PUBLIC
            ),
            is_internal=request.is_internal,
            is_edited=False,
            is_deleted=False,
        )

        return self._repository.create(comment)

    def get_comment(
        self,
        comment_id: UUID,
        organization_id: UUID,
    ) -> Comment:
        """Return a comment by ID, scoped to its organization."""
        comment = self._repository.get(comment_id, organization_id)

        if comment is None:
            raise CommentNotFoundError()

        return comment

    def list_comments(
        self,
        *,
        organization_id: UUID,
        ticket_id: UUID | None = None,
        author_id: UUID | None = None,
        is_internal: bool | None = None,
        search: str | None = None,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Comment]:
        """Return comments, scoped to an organization."""
        return self._repository.list(
            organization_id=organization_id,
            ticket_id=ticket_id,
            author_id=author_id,
            is_internal=is_internal,
            search=search,
            offset=offset,
            limit=limit,
        )

    def count_comments(
        self,
        *,
        organization_id: UUID,
        ticket_id: UUID | None = None,
        author_id: UUID | None = None,
        is_internal: bool | None = None,
        search: str | None = None,
    ) -> int:
        """Return the number of comments matching the given filters."""
        return self._repository.count(
            organization_id=organization_id,
            ticket_id=ticket_id,
            author_id=author_id,
            is_internal=is_internal,
            search=search,
        )

    def update_comment(
        self,
        comment_id: UUID,
        organization_id: UUID,
        requesting_user_id: UUID,
        request: UpdateCommentRequest,
    ) -> Comment:
        """Update a comment. Only the original author may update it."""
        comment = self.get_comment(comment_id, organization_id)

        if comment.author_id != requesting_user_id:
            raise CommentPermissionDeniedError()

        update_data = request.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        if not update_data:
            return comment

        if "content" in update_data:
            comment.content = update_data["content"]

        if "is_internal" in update_data:
            comment.is_internal = update_data["is_internal"]
            comment.visibility = (
                CommentVisibility.INTERNAL
                if update_data["is_internal"]
                else CommentVisibility.PUBLIC
            )

        comment.mark_edited()

        return self._repository.update(comment)

    def delete_comment(
        self,
        comment_id: UUID,
        organization_id: UUID,
        requesting_user_id: UUID,
    ) -> None:
        """Delete a comment. Only the original author may delete it."""
        comment = self.get_comment(comment_id, organization_id)

        if comment.author_id != requesting_user_id:
            raise CommentPermissionDeniedError()

        self._repository.delete(comment)
