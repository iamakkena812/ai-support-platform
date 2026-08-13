"""Notification repository tests."""

from __future__ import annotations

from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.user import User
from app.notifications.constants import NotificationType
from app.notifications.models import Notification
from app.notifications.repository import NotificationRepository


def build_notification(
    organization: Organization,
    user: User,
    *,
    title: str = "New Notification",
    message: str = "This is a notification.",
    notification_type: NotificationType = NotificationType.INFO,
    is_read: bool = False,
) -> Notification:
    """Build a notification instance."""
    return Notification(
        organization_id=organization.id,
        recipient_id=user.id,
        title=title,
        message=message,
        notification_type=notification_type,
        is_read=is_read,
        is_active=True,
    )


def test_create_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Create a notification."""
    repository = NotificationRepository(db_session)

    notification = build_notification(organization, user)

    result = repository.create(notification)

    assert result.id is not None
    assert result.title == "New Notification"


def test_get_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Get a notification scoped to its organization."""
    repository = NotificationRepository(db_session)

    notification = repository.create(build_notification(organization, user))

    result = repository.get(notification.id, organization.id)

    assert result is not None
    assert result.id == notification.id


def test_get_notification_wrong_organization_returns_none(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Return None when the notification belongs to another organization."""
    repository = NotificationRepository(db_session)

    notification = repository.create(build_notification(organization, user))

    result = repository.get(notification.id, uuid4())

    assert result is None


def test_get_missing_notification(
    db_session: Session,
    organization: Organization,
) -> None:
    """Return None for a missing notification."""
    repository = NotificationRepository(db_session)

    result = repository.get(uuid4(), organization.id)

    assert result is None


def test_list_notifications_scoped_to_recipient(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """List notifications scoped to organization and recipient."""
    repository = NotificationRepository(db_session)

    repository.create(build_notification(organization, user))

    notifications = repository.list(
        organization_id=organization.id,
        recipient_id=user.id,
    )

    assert len(notifications) >= 1


def test_list_excludes_other_recipients(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Exclude notifications belonging to a different recipient."""
    repository = NotificationRepository(db_session)

    repository.create(build_notification(organization, user))

    notifications = repository.list(
        organization_id=organization.id,
        recipient_id=uuid4(),
    )

    assert notifications == []


def test_list_filters_by_type(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Filter notifications by notification type."""
    repository = NotificationRepository(db_session)

    repository.create(
        build_notification(
            organization,
            user,
            notification_type=NotificationType.WARNING,
        )
    )
    repository.create(
        build_notification(
            organization,
            user,
            notification_type=NotificationType.INFO,
        )
    )

    notifications = repository.list(
        organization_id=organization.id,
        recipient_id=user.id,
        notification_type=NotificationType.WARNING,
    )

    assert len(notifications) == 1
    assert notifications[0].notification_type == NotificationType.WARNING


def test_list_filters_by_read_status(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Filter notifications by read status."""
    repository = NotificationRepository(db_session)

    repository.create(build_notification(organization, user, is_read=True))
    repository.create(build_notification(organization, user, is_read=False))

    unread = repository.list(
        organization_id=organization.id,
        recipient_id=user.id,
        is_read=False,
    )

    assert all(not n.is_read for n in unread)


def test_list_filters_by_search(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Filter notifications by search text."""
    repository = NotificationRepository(db_session)

    repository.create(
        build_notification(organization, user, title="Invoice ready")
    )
    repository.create(
        build_notification(organization, user, title="Server maintenance")
    )

    results = repository.list(
        organization_id=organization.id,
        recipient_id=user.id,
        search="invoice",
    )

    assert len(results) == 1
    assert results[0].title == "Invoice ready"


def test_count_notifications(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Count notifications matching filters."""
    repository = NotificationRepository(db_session)

    for index in range(3):
        repository.create(
            build_notification(organization, user, title=f"Notification {index}")
        )

    total = repository.count(
        organization_id=organization.id,
        recipient_id=user.id,
    )

    assert total >= 3


def test_list_unread_notifications(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """List unread notifications."""
    repository = NotificationRepository(db_session)

    repository.create(build_notification(organization, user, is_read=False))

    notifications = repository.list_unread(user.id, organization.id)

    assert len(notifications) >= 1
    assert notifications[0].is_read is False


def test_update_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Update a notification."""
    repository = NotificationRepository(db_session)

    notification = repository.create(build_notification(organization, user))

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

    notification = repository.create(build_notification(organization, user))

    repository.delete(notification)

    assert notification.is_deleted is True
    assert notification.is_active is False
    assert repository.get(notification.id, organization.id) is None


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
        organization_id=organization.id,
        recipient_id=user.id,
        offset=0,
        limit=3,
    )

    assert len(notifications) == 3


def test_recipient_relationship_resolves(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """The recipient relationship resolves to the correct user."""
    repository = NotificationRepository(db_session)

    notification = repository.create(build_notification(organization, user))

    result = repository.get(notification.id, organization.id)

    assert result is not None
    assert result.recipient.id == user.id
