"""Pydantic schemas for notifications."""

from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import Field

from app.core.schemas import CamelModel
from app.notifications.constants import (
    MESSAGE_MAX_LENGTH,
    MESSAGE_MIN_LENGTH,
    TITLE_MAX_LENGTH,
    TITLE_MIN_LENGTH,
    NotificationType,
)
from app.notifications.models import Notification

NotificationStatus = Literal["unread", "read"]


class CreateNotificationRequest(CamelModel):
    """Request schema for creating a notification."""

    recipient_id: UUID

    title: str = Field(
        min_length=TITLE_MIN_LENGTH,
        max_length=TITLE_MAX_LENGTH,
    )

    message: str = Field(
        min_length=MESSAGE_MIN_LENGTH,
        max_length=MESSAGE_MAX_LENGTH,
    )

    notification_type: NotificationType = Field(alias="type")


class UpdateNotificationRequest(CamelModel):
    """Request schema for updating a notification."""

    title: str | None = Field(
        default=None,
        min_length=TITLE_MIN_LENGTH,
        max_length=TITLE_MAX_LENGTH,
    )

    message: str | None = Field(
        default=None,
        min_length=MESSAGE_MIN_LENGTH,
        max_length=MESSAGE_MAX_LENGTH,
    )

    notification_type: NotificationType | None = Field(
        default=None,
        alias="type",
    )

    status: NotificationStatus | None = None


class NotificationRecipientRef(CamelModel):
    """Notification recipient reference."""

    id: UUID
    name: str
    email: str


class NotificationRead(CamelModel):
    """Notification response schema."""

    id: UUID
    title: str
    message: str
    notification_type: NotificationType = Field(alias="type")
    status: NotificationStatus
    recipient: NotificationRecipientRef
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_notification(cls, notification: Notification) -> NotificationRead:
        """Build a response from a notification, resolving the recipient ref."""
        return cls(
            id=notification.id,
            title=notification.title,
            message=notification.message,
            type=notification.notification_type,
            status="read" if notification.is_read else "unread",
            recipient=NotificationRecipientRef(
                id=notification.recipient.id,
                name=notification.recipient.full_name,
                email=notification.recipient.email,
            ),
            created_at=notification.created_at,
            updated_at=notification.updated_at,
        )


class NotificationListResponse(CamelModel):
    """Paginated notification list response."""

    items: list[NotificationRead]
    total: int
    page: int
    page_size: int
    total_pages: int
