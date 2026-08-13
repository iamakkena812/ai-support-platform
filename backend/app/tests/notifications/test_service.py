"""Notification service tests."""

from __future__ import annotations

from uuid import uuid4

from pytest import raises
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.user import User
from app.notifications.constants import NotificationType
from app.notifications.exceptions import (
    NotificationNotFoundError,
    NotificationPermissionDeniedError,
    NotificationRecipientNotFoundError,
)
from app.notifications.repository import NotificationRepository
from app.notifications.schemas import (
    CreateNotificationRequest,
    UpdateNotificationRequest,
)
from app.notifications.service import NotificationService
from app.repositories.user import UserRepository


def build_service(db_session: Session) -> NotificationService:
    """Build a notification service with real repositories."""
    return NotificationService(
        NotificationRepository(db_session),
        UserRepository(db_session),
    )


def build_request(
    recipient_id: object,
    **overrides: object,
) -> CreateNotificationRequest:
    """Build a notification creation request."""
    data: dict[str, object] = {
        "recipient_id": recipient_id,
        "title": "New Notification",
        "message": "This is a notification.",
        "notification_type": NotificationType.INFO,
    }
    data.update(overrides)

    return CreateNotificationRequest.model_validate(data)


def test_create_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Create a notification for a recipient in the same organization."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    assert notification.id is not None
    assert notification.title == "New Notification"
    assert notification.recipient_id == user.id
    assert notification.organization_id == organization.id


def test_create_notification_rejects_missing_recipient(
    db_session: Session,
    organization: Organization,
) -> None:
    """Reject notification creation for a nonexistent recipient."""
    service = build_service(db_session)

    with raises(NotificationRecipientNotFoundError):
        service.create_notification(
            organization_id=organization.id,
            request=build_request(uuid4()),
        )


def test_create_notification_rejects_recipient_from_other_organization(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Reject notification creation for a recipient in a different organization."""
    service = build_service(db_session)

    other_organization = Organization(
        name="Other Org",
        code=f"OTHER-{uuid4().hex[:8]}",
        email=f"{uuid4().hex[:8]}@other-example.com",
        phone="+919999999998",
        website="https://other-example.com",
        logo_url="https://other-example.com/logo.png",
        address="1 Other Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500002",
        timezone="Asia/Kolkata",
        is_active=True,
    )
    db_session.add(other_organization)
    db_session.commit()
    db_session.refresh(other_organization)

    with raises(NotificationRecipientNotFoundError):
        service.create_notification(
            organization_id=other_organization.id,
            request=build_request(user.id),
        )


def test_get_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Return a notification for its recipient."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    result = service.get_notification(notification.id, organization.id, user.id)

    assert result.id == notification.id


def test_get_missing_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Raise notification not found."""
    service = build_service(db_session)

    with raises(NotificationNotFoundError):
        service.get_notification(uuid4(), organization.id, user.id)


def test_get_notification_rejects_non_recipient(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Raise permission denied for a user who is not the recipient."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    with raises(NotificationPermissionDeniedError):
        service.get_notification(notification.id, organization.id, uuid4())


def test_list_notifications(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Return notification list for the recipient."""
    service = build_service(db_session)

    service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    notifications = service.list_notifications(
        organization_id=organization.id,
        recipient_id=user.id,
    )

    assert len(notifications) >= 1


def test_list_notifications_filters_by_status(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Filter notifications by read/unread status."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )
    service.mark_as_read(notification.id, organization.id, user.id)

    read_only = service.list_notifications(
        organization_id=organization.id,
        recipient_id=user.id,
        status="read",
    )

    assert all(n.is_read for n in read_only)
    assert any(n.id == notification.id for n in read_only)


def test_update_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Update a notification as its recipient."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    updated = service.update_notification(
        notification.id,
        organization.id,
        user.id,
        UpdateNotificationRequest(
            title="Updated Notification",
            message="Updated message.",
            status="read",
        ),
    )

    assert updated.title == "Updated Notification"
    assert updated.message == "Updated message."
    assert updated.is_read is True


def test_update_notification_rejects_non_recipient(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Reject updates from a user who is not the recipient."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    with raises(NotificationPermissionDeniedError):
        service.update_notification(
            notification.id,
            organization.id,
            uuid4(),
            UpdateNotificationRequest(title="Hijacked"),
        )


def test_mark_notification_read(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Mark a notification as read."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    updated = service.mark_as_read(notification.id, organization.id, user.id)

    assert updated.is_read is True


def test_mark_notification_unread(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Mark a notification as unread."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    service.mark_as_read(notification.id, organization.id, user.id)
    updated = service.mark_as_unread(notification.id, organization.id, user.id)

    assert updated.is_read is False


def test_delete_notification(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Delete a notification as its recipient."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    service.delete_notification(notification.id, organization.id, user.id)

    with raises(NotificationNotFoundError):
        service.get_notification(notification.id, organization.id, user.id)


def test_delete_notification_rejects_non_recipient(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """Reject deletion from a user who is not the recipient."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    with raises(NotificationPermissionDeniedError):
        service.delete_notification(notification.id, organization.id, uuid4())


def test_notification_isolated_from_other_organization(
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """A notification is not visible when queried under another organization."""
    service = build_service(db_session)

    notification = service.create_notification(
        organization_id=organization.id,
        request=build_request(user.id),
    )

    with raises(NotificationNotFoundError):
        service.get_notification(notification.id, uuid4(), user.id)
