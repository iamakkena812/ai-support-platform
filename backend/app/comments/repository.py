"""Comment repository."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session
from sqlalchemy.sql import Select

from app.comments.models import Comment


class CommentRepository:
    """Repository for comment persistence."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize repository."""
        self._session = session

    def create(
        self,
        comment: Comment,
    ) -> Comment:
        """Create a comment."""
        self._session.add(comment)
        self._session.commit()
        self._session.refresh(comment)

        return comment

    def get(
        self,
        comment_id: UUID,
        organization_id: UUID,
    ) -> Comment | None:
        """Return a comment by ID, scoped to its organization."""
        statement = select(Comment).where(
            Comment.id == comment_id,
            Comment.organization_id == organization_id,
            Comment.is_deleted.is_(False),
        )

        return self._session.scalar(statement)

    def list(
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
        """Return a paginated list of comments, scoped to an organization."""
        statement = select(Comment).where(
            Comment.organization_id == organization_id,
            Comment.is_deleted.is_(False),
        )
        statement = self._apply_filters(
            statement,
            ticket_id=ticket_id,
            author_id=author_id,
            is_internal=is_internal,
            search=search,
        )

        statement = statement.offset(offset).limit(limit)

        return list(self._session.scalars(statement).all())

    def count(
        self,
        *,
        organization_id: UUID,
        ticket_id: UUID | None = None,
        author_id: UUID | None = None,
        is_internal: bool | None = None,
        search: str | None = None,
    ) -> int:
        """Return the number of comments matching the given filters."""
        statement = (
            select(func.count())
            .select_from(Comment)
            .where(
                Comment.organization_id == organization_id,
                Comment.is_deleted.is_(False),
            )
        )
        statement = self._apply_filters(
            statement,
            ticket_id=ticket_id,
            author_id=author_id,
            is_internal=is_internal,
            search=search,
        )

        return int(self._session.scalar(statement) or 0)

    @staticmethod
    def _apply_filters(
        statement: Select[Any],
        *,
        ticket_id: UUID | None,
        author_id: UUID | None,
        is_internal: bool | None,
        search: str | None,
    ) -> Select[Any]:
        """Apply shared list/count filters to a select statement."""
        if ticket_id is not None:
            statement = statement.where(Comment.ticket_id == ticket_id)

        if author_id is not None:
            statement = statement.where(Comment.author_id == author_id)

        if is_internal is not None:
            statement = statement.where(Comment.is_internal == is_internal)

        if search:
            statement = statement.where(Comment.content.ilike(f"%{search}%"))

        return statement

    def update(
        self,
        comment: Comment,
    ) -> Comment:
        """Update a comment."""
        self._session.add(comment)
        self._session.commit()
        self._session.refresh(comment)

        return comment

    def delete(
        self,
        comment: Comment,
    ) -> None:
        """Soft delete a comment."""
        comment.soft_delete()

        self._session.add(comment)
        self._session.commit()
        self._session.refresh(comment)
