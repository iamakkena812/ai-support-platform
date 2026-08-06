"""Comment repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

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
    ) -> Comment | None:
        """Return a comment by ID."""
        statement = select(Comment).where(
            Comment.id == comment_id,
            Comment.is_deleted.is_(False),
        )

        return self._session.scalar(statement)

    def list(
        self,
        *,
        ticket_id: UUID | None = None,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Comment]:
        """Return a paginated list of comments."""
        statement = select(Comment).where(
            Comment.is_deleted.is_(False),
        )

        if ticket_id is not None:
            statement = statement.where(Comment.ticket_id == ticket_id)

        statement = statement.offset(offset).limit(limit)

        return list(self._session.scalars(statement).all())

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
