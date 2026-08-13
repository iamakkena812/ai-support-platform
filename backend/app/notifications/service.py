"""Notification service."""

from __future__ import annotations

from uuid import UUID

from app.notifications.constants import NotificationType
from app.notifications.exceptions import (
    NotificationNotFoundError,
    NotificationPermissionDeniedError,
    NotificationRecipientNotFoundError,
)
from app.notifications.models import Notification
from app.notifications.repository import NotificationRepository
from app.notifications.schemas import (
    CreateNotificationRequest,
    UpdateNotificationRequest,
)
from app.repositories.user import UserRepository


class NotificationService:
    """Business logic for notification management."""

    def __init__(
        self,
        repository: NotificationRepository,
        user_repository: UserRepository,
    ) -> None:
        """Initialize the notification service."""
        self._repository = repository
        self._user_repository = user_repository

    def create_notification(
        self,
        *,
        organization_id: UUID,
        request: CreateNotificationRequest,
    ) -> Notification:
        """Create a new notification for a recipient in the caller's organization."""
        recipient = self._user_repository.get(request.recipient_id)

        if recipient is None or recipient.organization_id != organization_id:
            raise NotificationRecipientNotFoundError

        notification = Notification(
            organization_id=organization_id,
            recipient_id=request.recipient_id,
            title=request.title,
            message=request.message,
            notification_type=request.notification_type,
            is_read=False,
            is_active=True,
        )

        return self._repository.create(notification)

    def get_notification(
        self,
        notification_id: UUID,
        organization_id: UUID,
        recipient_id: UUID,
    ) -> Notification:
        """Return a notification, enforcing organization and recipient scoping."""
        notification = self._repository.get(notification_id, organization_id)

        if notification is None:
            raise NotificationNotFoundError

        if notification.recipient_id != recipient_id:
            raise NotificationPermissionDeniedError

        return notification

    def list_notifications(
        self,
        *,
        organization_id: UUID,
        recipient_id: UUID,
        notification_type: NotificationType | None = None,
        status: str | None = None,
        search: str | None = None,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Notification]:
        """Return a paginated, filtered list of the recipient's notifications."""
        return self._repository.list(
            organization_id=organization_id,
            recipient_id=recipient_id,
            notification_type=notification_type,
            is_read=_status_to_is_read(status),
            search=search,
            offset=offset,
            limit=limit,
        )

    def count_notifications(
        self,
        *,
        organization_id: UUID,
        recipient_id: UUID,
        notification_type: NotificationType | None = None,
        status: str | None = None,
        search: str | None = None,
    ) -> int:
        """Return the total number of notifications matching the filters."""
        return self._repository.count(
            organization_id=organization_id,
            recipient_id=recipient_id,
            notification_type=notification_type,
            is_read=_status_to_is_read(status),
            search=search,
        )

    def list_unread_notifications(
        self,
        recipient_id: UUID,
        organization_id: UUID,
    ) -> list[Notification]:
        """Return unread notifications for a recipient."""
        return self._repository.list_unread(recipient_id, organization_id)

    def update_notification(
        self,
        notification_id: UUID,
        organization_id: UUID,
        recipient_id: UUID,
        request: UpdateNotificationRequest,
    ) -> Notification:
        """Update an existing notification. Only the recipient may update it."""
        notification = self.get_notification(
            notification_id,
            organization_id,
            recipient_id,
        )

        if request.title is not None:
            notification.title = request.title

        if request.message is not None:
            notification.message = request.message

        if request.notification_type is not None:
            notification.notification_type = request.notification_type

        if request.status is not None:
            if request.status == "read":
                notification.mark_as_read()
            else:
                notification.mark_as_unread()

        return self._repository.update(notification)

    def mark_as_read(
        self,
        notification_id: UUID,
        organization_id: UUID,
        recipient_id: UUID,
    ) -> Notification:
        """Mark a notification as read. Only the recipient may mark it."""
        notification = self.get_notification(
            notification_id,
            organization_id,
            recipient_id,
        )

        notification.mark_as_read()

        return self._repository.update(notification)

    def mark_as_unread(
        self,
        notification_id: UUID,
        organization_id: UUID,
        recipient_id: UUID,
    ) -> Notification:
        """Mark a notification as unread. Only the recipient may mark it."""
        notification = self.get_notification(
            notification_id,
            organization_id,
            recipient_id,
        )

        notification.mark_as_unread()

        return self._repository.update(notification)

    def delete_notification(
        self,
        notification_id: UUID,
        organization_id: UUID,
        recipient_id: UUID,
    ) -> None:
        """Delete a notification. Only the recipient may delete it."""
        notification = self.get_notification(
            notification_id,
            organization_id,
            recipient_id,
        )

        self._repository.delete(notification)


def _status_to_is_read(status: str | None) -> bool | None:
    """Translate a "read"/"unread" status filter into an is_read flag."""
    if status == "read":
        return True

    if status == "unread":
        return False

    return None
