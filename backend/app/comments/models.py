"""Comment models."""

from __future__ import annotations

from uuid import UUID, uuid4

from sqlalchemy import Boolean, Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.comments.constants import CommentVisibility
from app.database.base import Base
from app.models.mixins import TimestampMixin


class Comment(TimestampMixin, Base):
    """Comment model."""

    __tablename__ = "comments"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    ticket_id: Mapped[UUID] = mapped_column(
        ForeignKey("tickets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    author_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    visibility: Mapped[CommentVisibility] = mapped_column(
        Enum(CommentVisibility),
        default=CommentVisibility.INTERNAL,
        nullable=False,
    )

    is_internal: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_edited: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    def mark_edited(self) -> None:
        """Mark the comment as edited."""
        self.is_edited = True

    def soft_delete(self) -> None:
        """Soft delete the comment."""
        self.is_deleted = True
