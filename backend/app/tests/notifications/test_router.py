"""Notification router tests."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.notifications.constants import (
    NotificationChannel,
    NotificationPriority,
    NotificationType,
)


def build_notification_payload() -> dict[str, str]:
    """Build notification payload."""
    return {
        "recipient_id": str(uuid4()),
        "title": "System Notification",
        "message": "This is a test notification.",
        "notification_type": NotificationType.SYSTEM.value,
        "priority": NotificationPriority.NORMAL.value,
        "channel": NotificationChannel.IN_APP.value,
    }


def test_create_notification(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Create a notification."""
    response = client.post(
        "/api/v1/notifications",
        headers=auth_headers,
        json=build_notification_payload(),
    )

    assert response.status_code == 201

    body = response.json()

    assert body["title"] == "System Notification"
    assert body["message"] == "This is a test notification."


def test_list_notifications(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List notifications."""
    response = client.get(
        "/api/v1/notifications",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_list_unread_notifications(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List unread notifications."""
    response = client.get(
        "/api/v1/notifications/unread",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_missing_notification(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for a missing notification."""
    response = client.get(
        f"/api/v1/notifications/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_notification(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Update an existing notification."""
    create_response = client.post(
        "/api/v1/notifications",
        headers=auth_headers,
        json=build_notification_payload(),
    )

    assert create_response.status_code == 201

    notification_id = create_response.json()["id"]

    response = client.put(
        f"/api/v1/notifications/{notification_id}",
        headers=auth_headers,
        json={
            "title": "Updated Notification",
            "message": "Updated message.",
            "is_read": True,
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["title"] == "Updated Notification"
    assert body["message"] == "Updated message."
    assert body["is_read"] is True


def test_mark_notification_read(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Mark notification as read."""
    create_response = client.post(
        "/api/v1/notifications",
        headers=auth_headers,
        json=build_notification_payload(),
    )

    assert create_response.status_code == 201

    notification_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/notifications/{notification_id}/read",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["is_read"] is True


def test_mark_notification_unread(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Mark notification as unread."""
    create_response = client.post(
        "/api/v1/notifications",
        headers=auth_headers,
        json=build_notification_payload(),
    )

    assert create_response.status_code == 201

    notification_id = create_response.json()["id"]

    client.patch(
        f"/api/v1/notifications/{notification_id}/read",
        headers=auth_headers,
    )

    response = client.patch(
        f"/api/v1/notifications/{notification_id}/unread",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["is_read"] is False


def test_delete_notification(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Delete a notification."""
    create_response = client.post(
        "/api/v1/notifications",
        headers=auth_headers,
        json=build_notification_payload(),
    )

    assert create_response.status_code == 201

    notification_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/notifications/{notification_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    response = client.get(
        f"/api/v1/notifications/{notification_id}",
        headers=auth_headers,
    )

    assert response.status_code == 404
