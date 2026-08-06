"""Notification service."""

from __future__ import annotations

from uuid import UUID

from app.core.exceptions import ResourceNotFoundException
from app.notifications.models import Notification
from app.notifications.repository import NotificationRepository
from app.notifications.schemas import (
    CreateNotificationRequest,
    UpdateNotificationRequest,
)


class NotificationService:
    """Business logic for notification management."""

    def __init__(
        self,
        repository: NotificationRepository,
    ) -> None:
        """Initialize the notification service."""
        self._repository = repository

    def create_notification(
        self,
        *,
        organization_id: UUID,
        request: CreateNotificationRequest,
    ) -> Notification:
        """Create a new notification."""
        notification = Notification(
            organization_id=organization_id,
            recipient_id=request.recipient_id,
            title=request.title,
            message=request.message,
            notification_type=request.notification_type,
            priority=request.priority,
            channel=request.channel,
            is_read=False,
            is_active=True,
        )

        return self._repository.create(notification)

    def get_notification(
        self,
        notification_id: UUID,
    ) -> Notification:
        """Return a notification by its identifier."""
        notification = self._repository.get(notification_id)

        if notification is None:
            raise ResourceNotFoundException(
                "Notification not found.",
            )

        return notification

    def list_notifications(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Notification]:
        """Return a paginated list of notifications."""
        return self._repository.list(
            offset=offset,
            limit=limit,
        )

    def list_recipient_notifications(
        self,
        recipient_id: UUID,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Notification]:
        """Return notifications for a recipient."""
        return self._repository.list_by_recipient(
            recipient_id,
            offset=offset,
            limit=limit,
        )

    def list_unread_notifications(
        self,
        recipient_id: UUID,
    ) -> list[Notification]:
        """Return unread notifications for a recipient."""
        return self._repository.list_unread(
            recipient_id,
        )

    def update_notification(
        self,
        notification_id: UUID,
        request: UpdateNotificationRequest,
    ) -> Notification:
        """Update an existing notification."""
        notification = self.get_notification(notification_id)

        if request.title is not None:
            notification.title = request.title

        if request.message is not None:
            notification.message = request.message

        if request.priority is not None:
            notification.priority = request.priority

        if request.channel is not None:
            notification.channel = request.channel

        if request.is_read is not None:
            notification.is_read = request.is_read

        if request.is_active is not None:
            notification.is_active = request.is_active

        return self._repository.update(notification)

    def mark_as_read(
        self,
        notification_id: UUID,
    ) -> Notification:
        """Mark a notification as read."""
        notification = self.get_notification(notification_id)

        notification.mark_as_read()

        return self._repository.update(notification)

    def mark_as_unread(
        self,
        notification_id: UUID,
    ) -> Notification:
        """Mark a notification as unread."""
        notification = self.get_notification(notification_id)

        notification.mark_as_unread()

        return self._repository.update(notification)

    def delete_notification(
        self,
        notification_id: UUID,
    ) -> None:
        """Delete a notification."""
        notification = self.get_notification(notification_id)
        self._repository.delete(notification)
