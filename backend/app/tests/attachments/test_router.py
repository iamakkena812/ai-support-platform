"""Attachment router tests."""

from __future__ import annotations

from pathlib import Path
from typing import cast
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth.password import hash_password
from app.config.settings import settings
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User


@pytest.fixture(autouse=True)
def _isolated_upload_path(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Redirect attachment storage to a throwaway directory for each test."""
    monkeypatch.setattr(settings, "UPLOAD_PATH", str(tmp_path))


def upload_attachment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket_id: object,
    *,
    filename: str = "invoice.pdf",
    content: bytes = b"%PDF-1.4 sample",
    content_type: str = "application/pdf",
) -> dict[str, object]:
    """Upload an attachment for a ticket and return the response body."""
    response = client.post(
        f"/api/v1/attachments/tickets/{ticket_id}",
        headers=auth_headers,
        files={"file": (filename, content, content_type)},
    )

    assert response.status_code == 201

    return cast(dict[str, object], response.json())


def test_create_ticket_attachment(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Upload an attachment for an existing ticket."""
    body = upload_attachment(client, auth_headers, ticket.id)

    assert body["id"]
    assert body["ticketId"] == str(ticket.id)
    assert body["fileName"]
    assert body["originalFileName"] == "invoice.pdf"
    assert body["contentType"] == "application/pdf"
    assert body["fileSize"] == len(b"%PDF-1.4 sample")
    uploaded_by = cast(dict[str, object], body["uploadedBy"])
    ticket_ref = cast(dict[str, object], body["ticket"])
    assert uploaded_by["id"] == str(user.id)
    assert ticket_ref["id"] == str(ticket.id)
    assert body["downloadUrl"] == f"/api/v1/attachments/{body['id']}/download"


def test_create_ticket_attachment_requires_authentication(
    client: TestClient,
    ticket: Ticket,
) -> None:
    """Reject anonymous uploads."""
    response = client.post(
        f"/api/v1/attachments/tickets/{ticket.id}",
        files={"file": ("invoice.pdf", b"content", "application/pdf")},
    )

    assert response.status_code == 401


def test_create_ticket_attachment_missing_ticket_returns_404(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 when the parent ticket does not exist."""
    response = client.post(
        f"/api/v1/attachments/tickets/{uuid4()}",
        headers=auth_headers,
        files={"file": ("invoice.pdf", b"content", "application/pdf")},
    )

    assert response.status_code == 404


def test_create_ticket_attachment_rejects_unsupported_type(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Reject uploads with an unsupported MIME type."""
    response = client.post(
        f"/api/v1/attachments/tickets/{ticket.id}",
        headers=auth_headers,
        files={"file": ("script.exe", b"MZ", "application/x-msdownload")},
    )

    assert response.status_code == 400


def test_list_attachments(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """List attachments as a paginated envelope."""
    upload_attachment(client, auth_headers, ticket.id)

    response = client.get(
        "/api/v1/attachments",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()
    assert isinstance(body["items"], list)
    assert body["total"] >= 1
    assert "page" in body
    assert "pageSize" in body
    assert "totalPages" in body


def test_list_attachments_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous listing."""
    response = client.get("/api/v1/attachments")

    assert response.status_code == 401


def test_list_attachments_filters_by_ticket(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Filter attachments by ticket."""
    body = upload_attachment(client, auth_headers, ticket.id)

    response = client.get(
        "/api/v1/attachments",
        headers=auth_headers,
        params={"ticketId": str(ticket.id)},
    )

    assert response.status_code == 200
    items = response.json()["items"]
    assert any(item["id"] == body["id"] for item in items)
    assert all(item["ticketId"] == str(ticket.id) for item in items)


def test_get_attachment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Retrieve an attachment by id."""
    created = upload_attachment(client, auth_headers, ticket.id)

    response = client.get(
        f"/api/v1/attachments/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_get_missing_attachment(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for a missing attachment."""
    response = client.get(
        f"/api/v1/attachments/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_download_attachment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Download an attachment and receive the original bytes back."""
    created = upload_attachment(
        client,
        auth_headers,
        ticket.id,
        content=b"exact bytes to verify",
    )

    response = client.get(
        f"/api/v1/attachments/{created['id']}/download",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.content == b"exact bytes to verify"
    assert response.headers["content-type"] == "application/pdf"
    assert "invoice.pdf" in response.headers["content-disposition"]


def test_download_missing_attachment(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 when downloading a missing attachment."""
    response = client.get(
        f"/api/v1/attachments/{uuid4()}/download",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_attachment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Rename an attachment as its uploader."""
    created = upload_attachment(client, auth_headers, ticket.id)

    response = client.put(
        f"/api/v1/attachments/{created['id']}",
        headers=auth_headers,
        json={"fileName": "renamed-invoice.pdf"},
    )

    assert response.status_code == 200
    assert response.json()["originalFileName"] == "renamed-invoice.pdf"


def test_delete_attachment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Delete an attachment and confirm it disappears from lookups."""
    created = upload_attachment(client, auth_headers, ticket.id)

    response = client.delete(
        f"/api/v1/attachments/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    follow_up = client.get(
        f"/api/v1/attachments/{created['id']}",
        headers=auth_headers,
    )
    assert follow_up.status_code == 404


def test_delete_attachment_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 while deleting a missing attachment."""
    response = client.delete(
        f"/api/v1/attachments/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def _other_org_headers(
    client: TestClient,
    db_session: Session,
) -> dict[str, str]:
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

    return {"Authorization": f"Bearer {token}"}


def test_attachment_is_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    ticket: Ticket,
) -> None:
    """An attachment created in one organization is invisible to another."""
    created = upload_attachment(client, auth_headers, ticket.id)

    other_headers = _other_org_headers(client, db_session)

    get_response = client.get(
        f"/api/v1/attachments/{created['id']}",
        headers=other_headers,
    )
    assert get_response.status_code == 404

    download_response = client.get(
        f"/api/v1/attachments/{created['id']}/download",
        headers=other_headers,
    )
    assert download_response.status_code == 404

    list_response = client.get(
        "/api/v1/attachments",
        headers=other_headers,
    )
    assert all(
        item["id"] != created["id"] for item in list_response.json()["items"]
    )


def test_update_attachment_rejects_non_uploader(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    organization: Organization,
    ticket: Ticket,
) -> None:
    """A different user in the same organization cannot rename the attachment."""
    created = upload_attachment(client, auth_headers, ticket.id)

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
    teammate_headers = {
        "Authorization": f"Bearer {login_response.json()['access_token']}",
    }

    response = client.put(
        f"/api/v1/attachments/{created['id']}",
        headers=teammate_headers,
        json={"fileName": "hijacked.pdf"},
    )

    assert response.status_code == 403


def test_delete_attachment_rejects_non_uploader(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    organization: Organization,
    ticket: Ticket,
) -> None:
    """A different user in the same organization cannot delete the attachment."""
    created = upload_attachment(client, auth_headers, ticket.id)

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
    teammate_headers = {
        "Authorization": f"Bearer {login_response.json()['access_token']}",
    }

    response = client.delete(
        f"/api/v1/attachments/{created['id']}",
        headers=teammate_headers,
    )

    assert response.status_code == 403
