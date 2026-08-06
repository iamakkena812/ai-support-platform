"""Pydantic schemas for notifications."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.notifications.constants import (
    MESSAGE_MAX_LENGTH,
    MESSAGE_MIN_LENGTH,
    TITLE_MAX_LENGTH,
    TITLE_MIN_LENGTH,
    NotificationChannel,
    NotificationPriority,
    NotificationType,
)


class CreateNotificationRequest(BaseModel):
    """Request model for creating a notification."""

    recipient_id: UUID

    title: str = Field(
        min_length=TITLE_MIN_LENGTH,
        max_length=TITLE_MAX_LENGTH,
    )

    message: str = Field(
        min_length=MESSAGE_MIN_LENGTH,
        max_length=MESSAGE_MAX_LENGTH,
    )

    notification_type: NotificationType

    priority: NotificationPriority = NotificationPriority.NORMAL

    channel: NotificationChannel = NotificationChannel.IN_APP


class UpdateNotificationRequest(BaseModel):
    """Request model for updating a notification."""

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

    priority: NotificationPriority | None = None

    channel: NotificationChannel | None = None

    is_read: bool | None = None

    is_active: bool | None = None


class MarkNotificationReadRequest(BaseModel):
    """Request model for marking a notification as read."""

    is_read: bool = True


class NotificationResponse(BaseModel):
    """Notification response."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID

    organization_id: UUID

    recipient_id: UUID

    title: str

    message: str

    notification_type: NotificationType

    priority: NotificationPriority

    channel: NotificationChannel

    is_read: bool

    is_active: bool

    created_at: datetime

    updated_at: datetime


class NotificationListResponse(BaseModel):
    """Paginated notification response."""

    total: int

    notifications: list[NotificationResponse]
