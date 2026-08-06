"""Notification models."""

from __future__ import annotations

from uuid import UUID, uuid4

from sqlalchemy import Boolean, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.mixins import TimestampMixin
from app.notifications.constants import (
    NotificationChannel,
    NotificationPriority,
    NotificationType,
)


class Notification(TimestampMixin, Base):
    """Notification model."""

    __tablename__ = "notifications"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    organization_id: Mapped[UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    recipient_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    notification_type: Mapped[NotificationType] = mapped_column(
        Enum(NotificationType),
        nullable=False,
    )

    priority: Mapped[NotificationPriority] = mapped_column(
        Enum(NotificationPriority),
        default=NotificationPriority.NORMAL,
        nullable=False,
    )

    channel: Mapped[NotificationChannel] = mapped_column(
        Enum(NotificationChannel),
        default=NotificationChannel.IN_APP,
        nullable=False,
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    def mark_as_read(self) -> None:
        """Mark the notification as read."""
        self.is_read = True

    def mark_as_unread(self) -> None:
        """Mark the notification as unread."""
        self.is_read = False

    def soft_delete(self) -> None:
        """Soft delete the notification."""
        self.is_deleted = True
        self.is_active = False
