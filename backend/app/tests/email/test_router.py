"""Email router tests."""

from __future__ import annotations

from typing import Any, cast
from uuid import uuid4

from fastapi.testclient import TestClient

from app.email.constants import (
    EmailPriority,
    EmailProvider,
    EmailStatus,
    EmailTemplate,
)


def create_email(
    client: TestClient,
    auth_headers: dict[str, str],
) -> str:
    """Create an email and return its id."""
    response = client.post(
        "/api/v1/emails",
        headers=auth_headers,
        json={
            "recipient": "customer@example.com",
            "subject": "Welcome",
            "body": "Welcome to our platform.",
            "cc": [],
            "bcc": [],
            "template": EmailTemplate.GENERIC.value,
            "provider": EmailProvider.SMTP.value,
            "priority": EmailPriority.NORMAL.value,
        },
    )

    assert response.status_code == 201

    body = cast(dict[str, Any], response.json())
    return str(body["id"])


def test_create_email(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Create an email."""
    response = client.post(
        "/api/v1/emails",
        headers=auth_headers,
        json={
            "recipient": "customer@example.com",
            "subject": "Welcome",
            "body": "Welcome to our platform.",
            "cc": [],
            "bcc": [],
            "template": EmailTemplate.GENERIC.value,
            "provider": EmailProvider.SMTP.value,
            "priority": EmailPriority.NORMAL.value,
        },
    )

    assert response.status_code == 201

    body = response.json()

    assert body["recipient"] == "customer@example.com"
    assert body["subject"] == "Welcome"
    assert body["body"] == "Welcome to our platform."
    assert body["status"] == EmailStatus.PENDING.value
    assert body["id"] is not None


def test_list_emails(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List emails."""
    response = client.get(
        "/api/v1/emails",
        headers=auth_headers,
    )

    create_email(
        client,
        auth_headers,
    )

    response = client.get(
        "/api/v1/emails",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] >= 1
    assert len(body["items"]) >= 1


def test_get_missing_email(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for missing email."""
    response = client.get(
        f"/api/v1/emails/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_email(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Update an email."""
    email_id = create_email(
        client,
        auth_headers,
    )

    response = client.patch(
        f"/api/v1/emails/{email_id}",
        headers=auth_headers,
        json={
            "subject": "Updated Subject",
            "body": "Updated Body",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["subject"] == "Updated Subject"
    assert body["body"] == "Updated Body"


def test_send_email(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Send an email."""
    email_id = create_email(
        client,
        auth_headers,
    )

    response = client.post(
        f"/api/v1/emails/{email_id}/send",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["status"] == EmailStatus.SENT.value
    assert body["sent_at"] is not None


def test_retry_email(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Retry an email."""
    email_id = create_email(
        client,
        auth_headers,
    )

    response = client.post(
        f"/api/v1/emails/{email_id}/retry",
        headers=auth_headers,
        json={
            "retry": True,
        },
    )

    body = response.json()

    assert body["status"] == EmailStatus.SENT.value


def test_cancel_email(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Cancel an email."""
    email_id = create_email(
        client,
        auth_headers,
    )

    response = client.post(
        f"/api/v1/emails/{email_id}/cancel",
        headers=auth_headers,
        json={
            "cancel": True,
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["status"] == EmailStatus.CANCELLED.value


def test_search_emails(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Search emails."""
    create_email(
        client,
        auth_headers,
    )

    response = client.get(
        "/api/v1/emails/search",
        headers=auth_headers,
        params={
            "status": EmailStatus.PENDING.value,
        },
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_email(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Delete an email."""
    email_id = create_email(
        client,
        auth_headers,
    )

    response = client.delete(
        f"/api/v1/emails/{email_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    response = client.get(
        f"/api/v1/emails/{email_id}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_get_email(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Get an existing email."""
    email_id = create_email(
        client,
        auth_headers,
    )

    response = client.get(
        f"/api/v1/emails/{email_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["id"] == email_id
    assert body["recipient"] == "customer@example.com"
    assert body["subject"] == "Welcome"
    assert body["body"] == "Welcome to our platform."
    assert body["status"] == EmailStatus.PENDING.value
