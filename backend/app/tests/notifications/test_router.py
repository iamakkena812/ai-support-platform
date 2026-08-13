"""Notification router tests."""

from __future__ import annotations

from typing import cast
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth.password import hash_password
from app.models.organization import Organization
from app.models.user import User


def build_notification_payload(
    recipient_id: object,
    **overrides: object,
) -> dict[str, object]:
    """Build a notification creation payload."""
    payload: dict[str, object] = {
        "recipientId": str(recipient_id),
        "title": "System Notification",
        "message": "This is a test notification.",
        "type": "info",
    }
    payload.update(overrides)

    return payload


def create_notification(
    client: TestClient,
    auth_headers: dict[str, str],
    recipient_id: object,
    **overrides: object,
) -> dict[str, object]:
    """Create a notification and return the response body."""
    response = client.post(
        "/api/v1/notifications",
        headers=auth_headers,
        json=build_notification_payload(recipient_id, **overrides),
    )

    assert response.status_code == 201

    return cast(dict[str, object], response.json())


def test_create_notification(
    client: TestClient,
    auth_headers: dict[str, str],
    user: User,
) -> None:
    """Create a notification for a recipient in the caller's organization."""
    body = create_notification(client, auth_headers, user.id)

    assert body["id"]
    assert body["title"] == "System Notification"
    assert body["message"] == "This is a test notification."
    assert body["type"] == "info"
    assert body["status"] == "unread"
    recipient = cast(dict[str, object], body["recipient"])
    assert recipient["id"] == str(user.id)


def test_create_notification_requires_authentication(
    client: TestClient,
    user: User,
) -> None:
    """Reject anonymous notification creation."""
    response = client.post(
        "/api/v1/notifications",
        json=build_notification_payload(user.id),
    )

    assert response.status_code == 401


def test_create_notification_rejects_missing_recipient(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 when the recipient does not exist."""
    response = client.post(
        "/api/v1/notifications",
        headers=auth_headers,
        json=build_notification_payload(uuid4()),
    )

    assert response.status_code == 404


def test_list_notifications(
    client: TestClient,
    auth_headers: dict[str, str],
    user: User,
) -> None:
    """List notifications as a paginated envelope."""
    create_notification(client, auth_headers, user.id)

    response = client.get(
        "/api/v1/notifications",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()
    assert isinstance(body["items"], list)
    assert body["total"] >= 1
    assert "page" in body
    assert "pageSize" in body
    assert "totalPages" in body


def test_list_notifications_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous listing."""
    response = client.get("/api/v1/notifications")

    assert response.status_code == 401


def test_list_notifications_filters_by_status(
    client: TestClient,
    auth_headers: dict[str, str],
    user: User,
) -> None:
    """Filter notifications by read/unread status."""
    body = create_notification(client, auth_headers, user.id)

    client.patch(
        f"/api/v1/notifications/{body['id']}/read",
        headers=auth_headers,
    )

    response = client.get(
        "/api/v1/notifications",
        headers=auth_headers,
        params={"status": "read"},
    )

    assert response.status_code == 200
    items = response.json()["items"]
    assert any(item["id"] == body["id"] for item in items)
    assert all(item["status"] == "read" for item in items)


def test_list_unread_notifications(
    client: TestClient,
    auth_headers: dict[str, str],
    user: User,
) -> None:
    """List unread notifications."""
    create_notification(client, auth_headers, user.id)

    response = client.get(
        "/api/v1/notifications/unread",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_notification(
    client: TestClient,
    auth_headers: dict[str, str],
    user: User,
) -> None:
    """Retrieve a notification by id."""
    created = create_notification(client, auth_headers, user.id)

    response = client.get(
        f"/api/v1/notifications/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


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
    user: User,
) -> None:
    """Update a notification as its recipient."""
    created = create_notification(client, auth_headers, user.id)

    response = client.put(
        f"/api/v1/notifications/{created['id']}",
        headers=auth_headers,
        json={
            "title": "Updated Notification",
            "message": "Updated message.",
            "status": "read",
        },
    )

    assert response.status_code == 200

    body = response.json()
    assert body["title"] == "Updated Notification"
    assert body["message"] == "Updated message."
    assert body["status"] == "read"


def test_mark_notification_read(
    client: TestClient,
    auth_headers: dict[str, str],
    user: User,
) -> None:
    """Mark a notification as read."""
    created = create_notification(client, auth_headers, user.id)

    response = client.patch(
        f"/api/v1/notifications/{created['id']}/read",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["status"] == "read"


def test_mark_notification_unread(
    client: TestClient,
    auth_headers: dict[str, str],
    user: User,
) -> None:
    """Mark a notification as unread."""
    created = create_notification(client, auth_headers, user.id)

    client.patch(
        f"/api/v1/notifications/{created['id']}/read",
        headers=auth_headers,
    )

    response = client.patch(
        f"/api/v1/notifications/{created['id']}/unread",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["status"] == "unread"


def test_delete_notification(
    client: TestClient,
    auth_headers: dict[str, str],
    user: User,
) -> None:
    """Delete a notification and confirm it disappears from lookups."""
    created = create_notification(client, auth_headers, user.id)

    response = client.delete(
        f"/api/v1/notifications/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    follow_up = client.get(
        f"/api/v1/notifications/{created['id']}",
        headers=auth_headers,
    )
    assert follow_up.status_code == 404


def test_delete_notification_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 while deleting a missing notification."""
    response = client.delete(
        f"/api/v1/notifications/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def _create_teammate(
    db_session: Session,
    client: TestClient,
    organization: Organization,
) -> tuple[User, dict[str, str]]:
    """Create a second user in the same organization and return auth headers."""
    unique = uuid4().hex[:8]

    teammate = User(
        organization_id=organization.id,
        email=f"{unique}@example.com",
        username=f"teammate{unique}",
        full_name="Teammate User",
        password_hash=hash_password("Password123!"),
        is_active=True,
    )
    db_session.add(teammate)
    db_session.commit()
    db_session.refresh(teammate)

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": teammate.email, "password": "Password123!"},
    )
    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return teammate, {"Authorization": f"Bearer {token}"}


def test_notification_is_isolated_from_other_recipients(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    organization: Organization,
    user: User,
) -> None:
    """A notification is invisible, unmarkable and undeletable to a non-recipient."""
    created = create_notification(client, auth_headers, user.id)

    _teammate, teammate_headers = _create_teammate(db_session, client, organization)

    get_response = client.get(
        f"/api/v1/notifications/{created['id']}",
        headers=teammate_headers,
    )
    assert get_response.status_code == 403

    list_response = client.get(
        "/api/v1/notifications",
        headers=teammate_headers,
    )
    assert all(
        item["id"] != created["id"] for item in list_response.json()["items"]
    )

    update_response = client.put(
        f"/api/v1/notifications/{created['id']}",
        headers=teammate_headers,
        json={"title": "Hijacked"},
    )
    assert update_response.status_code == 403

    delete_response = client.delete(
        f"/api/v1/notifications/{created['id']}",
        headers=teammate_headers,
    )
    assert delete_response.status_code == 403


def _other_org_headers(
    client: TestClient,
    db_session: Session,
) -> tuple[User, dict[str, str]]:
    """Create a second organization/user and return their auth headers."""
    unique = uuid4().hex[:8]

    other_organization = Organization(
        name=f"Other Org {unique}",
        code=f"OTHERORG-{unique}",
        email=f"{unique}@other-example.com",
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

    other_user = User(
        organization_id=other_organization.id,
        email=f"{unique}@other-example.com",
        username=f"user{unique}",
        full_name="Other Org User",
        password_hash=hash_password("Password123!"),
        is_active=True,
    )
    db_session.add(other_user)
    db_session.commit()
    db_session.refresh(other_user)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": other_user.email, "password": "Password123!"},
    )
    assert response.status_code == 200

    token = response.json()["access_token"]

    return other_user, {"Authorization": f"Bearer {token}"}


def test_notification_creation_rejects_cross_organization_recipient(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """Creating a notification for a recipient in another organization returns 404."""
    other_user, _other_headers = _other_org_headers(client, db_session)

    response = client.post(
        "/api/v1/notifications",
        headers=auth_headers,
        json=build_notification_payload(other_user.id),
    )

    assert response.status_code == 404


def test_notification_is_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    user: User,
) -> None:
    """A notification created in one organization is invisible to another."""
    created = create_notification(client, auth_headers, user.id)

    _other_user, other_headers = _other_org_headers(client, db_session)

    get_response = client.get(
        f"/api/v1/notifications/{created['id']}",
        headers=other_headers,
    )
    assert get_response.status_code == 404

    list_response = client.get(
        "/api/v1/notifications",
        headers=other_headers,
    )
    assert all(
        item["id"] != created["id"] for item in list_response.json()["items"]
    )
