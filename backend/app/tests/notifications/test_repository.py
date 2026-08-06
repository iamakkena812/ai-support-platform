"""Notification repository tests."""

from __future__ import annotations

from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.user import User
from app.notifications.constants import (
    NotificationChannel,
    NotificationPriority,
    NotificationType,
)
from app.notifications.models import Notification
from app.notifications.repository import NotificationRepository


def build_notification(
    organization: Organization,
    user: User,
    *,
    title: str = "New Notification",
    message: str = "This is a notification.",
) -> Notification:
    """Build a notification instance."""
    return Notification(
        organization_id=organization.id,
        recipient_id=user.id,
        title=title,
        message=message,
        notification_type=NotificationType.SYSTEM,
        priority=NotificationPriority.NORMAL,
        channel=NotificationChannel.IN_APP,
        is_read=False,
        is_active=True,
    )


def test_create_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Create a notification."""
    repository = NotificationRepository(db_session)

    notification = build_notification(
        organization,
        user,
    )

    result = repository.create(notification)

    assert result.id is not None
    assert result.title == "New Notification"


def test_get_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Get a notification."""
    repository = NotificationRepository(db_session)

    notification = repository.create(
        build_notification(
            organization,
            user,
        )
    )

    result = repository.get(notification.id)

    assert result is not None
    assert result.id == notification.id


def test_get_missing_notification(
    db_session: Session,
) -> None:
    """Return None for missing notification."""
    repository = NotificationRepository(db_session)

    result = repository.get(uuid4())

    assert result is None


def test_list_notifications(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """List notifications."""
    repository = NotificationRepository(db_session)

    repository.create(
        build_notification(
            organization,
            user,
        )
    )

    notifications = repository.list()

    assert len(notifications) >= 1


def test_list_notifications_by_recipient(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """List notifications for a recipient."""
    repository = NotificationRepository(db_session)

    repository.create(
        build_notification(
            organization,
            user,
        )
    )

    notifications = repository.list_by_recipient(
        user.id,
    )

    assert len(notifications) >= 1


def test_list_unread_notifications(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """List unread notifications."""
    repository = NotificationRepository(db_session)

    repository.create(
        build_notification(
            organization,
            user,
        )
    )

    notifications = repository.list_unread(
        user.id,
    )

    assert len(notifications) >= 1
    assert notifications[0].is_read is False


def test_update_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Update a notification."""
    repository = NotificationRepository(db_session)

    notification = repository.create(
        build_notification(
            organization,
            user,
        )
    )

    notification.title = "Updated Notification"

    updated = repository.update(notification)

    assert updated.title == "Updated Notification"


def test_delete_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Soft delete a notification."""
    repository = NotificationRepository(db_session)

    notification = repository.create(
        build_notification(
            organization,
            user,
        )
    )

    repository.delete(notification)

    assert notification.is_deleted is True
    assert notification.is_active is False


def test_notification_pagination(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Return paginated notifications."""
    repository = NotificationRepository(db_session)

    for index in range(5):
        repository.create(
            build_notification(
                organization,
                user,
                title=f"Notification {index}",
                message=f"Message {index}",
            )
        )

    notifications = repository.list(
        offset=0,
        limit=3,
    )

    assert len(notifications) == 3
