"""Base ORM model definitions."""

from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.database.types import GUID


class BaseModel(TimestampMixin, Base):
    """Abstract base model for all database entities."""

    __abstract__ = True

    id: Mapped[UUID] = mapped_column(
        GUID(),
        primary_key=True,
        default=uuid4,
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    def soft_delete(self) -> None:
        """Mark the entity as deleted."""
        self.is_deleted = True
        self.deleted_at = datetime.now(UTC)

    def restore(self) -> None:
        """Restore a soft-deleted entity."""
        self.is_deleted = False
        self.deleted_at = None


__all__ = [
    "Base",
    "BaseModel",
    "TimestampMixin",
]
