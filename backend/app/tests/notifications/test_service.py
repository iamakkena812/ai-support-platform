"""Notification service tests."""

from __future__ import annotations

from uuid import uuid4

from pytest import raises
from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.models.organization import Organization
from app.models.user import User
from app.notifications.constants import (
    NotificationChannel,
    NotificationPriority,
    NotificationType,
)
from app.notifications.repository import NotificationRepository
from app.notifications.schemas import (
    CreateNotificationRequest,
    UpdateNotificationRequest,
)
from app.notifications.service import NotificationService


def build_request() -> CreateNotificationRequest:
    """Build a notification request."""
    return CreateNotificationRequest(
        recipient_id=uuid4(),
        title="New Notification",
        message="This is a notification.",
        notification_type=NotificationType.SYSTEM,
        priority=NotificationPriority.NORMAL,
        channel=NotificationChannel.IN_APP,
    )


def test_create_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Create a notification."""
    repository = NotificationRepository(db_session)
    service = NotificationService(repository)

    request = build_request()
    request.recipient_id = user.id

    notification = service.create_notification(
        organization_id=organization.id,
        request=request,
    )

    assert notification.id is not None
    assert notification.title == "New Notification"
    assert notification.recipient_id == user.id


def test_get_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Return a notification."""
    repository = NotificationRepository(db_session)
    service = NotificationService(repository)

    request = build_request()
    request.recipient_id = user.id

    notification = service.create_notification(
        organization_id=organization.id,
        request=request,
    )

    result = service.get_notification(notification.id)

    assert result.id == notification.id


def test_get_missing_notification(
    db_session: Session,
) -> None:
    """Raise notification not found."""
    repository = NotificationRepository(db_session)
    service = NotificationService(repository)

    with raises(ResourceNotFoundException):
        service.get_notification(uuid4())


def test_list_notifications(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Return notification list."""
    repository = NotificationRepository(db_session)
    service = NotificationService(repository)

    request = build_request()
    request.recipient_id = user.id

    service.create_notification(
        organization_id=organization.id,
        request=request,
    )

    notifications = service.list_notifications()

    assert len(notifications) >= 1


def test_update_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Update a notification."""
    repository = NotificationRepository(db_session)
    service = NotificationService(repository)

    request = build_request()
    request.recipient_id = user.id

    notification = service.create_notification(
        organization_id=organization.id,
        request=request,
    )

    updated = service.update_notification(
        notification.id,
        UpdateNotificationRequest(
            title="Updated Notification",
            message="Updated message.",
            is_read=True,
        ),
    )

    assert updated.title == "Updated Notification"
    assert updated.message == "Updated message."
    assert updated.is_read is True


def test_mark_notification_read(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Mark a notification as read."""
    repository = NotificationRepository(db_session)
    service = NotificationService(repository)

    request = build_request()
    request.recipient_id = user.id

    notification = service.create_notification(
        organization_id=organization.id,
        request=request,
    )

    updated = service.mark_as_read(notification.id)

    assert updated.is_read is True


def test_mark_notification_unread(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Mark a notification as unread."""
    repository = NotificationRepository(db_session)
    service = NotificationService(repository)

    request = build_request()
    request.recipient_id = user.id

    notification = service.create_notification(
        organization_id=organization.id,
        request=request,
    )

    service.mark_as_read(notification.id)

    updated = service.mark_as_unread(notification.id)

    assert updated.is_read is False


def test_delete_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Delete a notification."""
    repository = NotificationRepository(db_session)
    service = NotificationService(repository)

    request = build_request()
    request.recipient_id = user.id

    notification = service.create_notification(
        organization_id=organization.id,
        request=request,
    )

    service.delete_notification(notification.id)

    deleted = repository.get(notification.id)

    assert deleted is None
