"""Comment router tests."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth.password import hash_password
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User


def test_create_comment(
    client: TestClient,
    auth_headers: dict[str, str],
    user: User,
    ticket: Ticket,
) -> None:
    """Create a comment on an existing ticket."""
    response = client.post(
        f"/api/v1/comments/tickets/{ticket.id}",
        headers=auth_headers,
        json={
            "content": "First comment",
            "isInternal": True,
        },
    )

    assert response.status_code == 201

    body = response.json()

    assert body["content"] == "First comment"
    assert body["ticketId"] == str(ticket.id)
    assert body["isInternal"] is True
    assert body["author"]["id"] == str(user.id)
    assert body["ticket"]["id"] == str(ticket.id)


def test_create_comment_requires_authentication(
    client: TestClient,
    ticket: Ticket,
) -> None:
    """Reject anonymous comment creation."""
    response = client.post(
        f"/api/v1/comments/tickets/{ticket.id}",
        json={"content": "First comment"},
    )

    assert response.status_code == 401


def test_create_comment_missing_ticket_returns_404(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 when the parent ticket does not exist."""
    response = client.post(
        f"/api/v1/comments/tickets/{uuid4()}",
        headers=auth_headers,
        json={"content": "Orphan comment"},
    )

    assert response.status_code == 404


def test_list_comments(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """List comments as a paginated envelope."""
    client.post(
        f"/api/v1/comments/tickets/{ticket.id}",
        headers=auth_headers,
        json={"content": "Listed comment"},
    )

    response = client.get(
        "/api/v1/comments",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert isinstance(body["items"], list)
    assert body["total"] >= 1
    assert "page" in body
    assert "pageSize" in body
    assert "totalPages" in body


def test_list_comments_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous comment listing."""
    response = client.get("/api/v1/comments")

    assert response.status_code == 401


def test_list_comments_filters_by_ticket(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Filter comments by ticket."""
    create_response = client.post(
        f"/api/v1/comments/tickets/{ticket.id}",
        headers=auth_headers,
        json={"content": "Ticket-scoped comment"},
    )
    comment_id = create_response.json()["id"]

    response = client.get(
        "/api/v1/comments",
        headers=auth_headers,
        params={"ticketId": str(ticket.id)},
    )

    assert response.status_code == 200

    body = response.json()
    assert any(item["id"] == comment_id for item in body["items"])
    assert all(item["ticketId"] == str(ticket.id) for item in body["items"])


def test_get_comment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Return a comment by id."""
    create_response = client.post(
        f"/api/v1/comments/tickets/{ticket.id}",
        headers=auth_headers,
        json={"content": "Retrievable comment"},
    )
    comment_id = create_response.json()["id"]

    response = client.get(
        f"/api/v1/comments/{comment_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == comment_id


def test_get_missing_comment(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for a missing comment."""
    response = client.get(
        f"/api/v1/comments/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_comment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Update a comment as its author."""
    create_response = client.post(
        f"/api/v1/comments/tickets/{ticket.id}",
        headers=auth_headers,
        json={"content": "Original comment", "isInternal": True},
    )
    comment_id = create_response.json()["id"]

    response = client.put(
        f"/api/v1/comments/{comment_id}",
        headers=auth_headers,
        json={"content": "Updated comment", "isInternal": False},
    )

    assert response.status_code == 200

    body = response.json()
    assert body["content"] == "Updated comment"
    assert body["isInternal"] is False


def test_update_comment_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 while updating a missing comment."""
    response = client.put(
        f"/api/v1/comments/{uuid4()}",
        headers=auth_headers,
        json={"content": "Does not matter"},
    )

    assert response.status_code == 404


def test_delete_comment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Delete a comment and confirm it disappears from lookups."""
    create_response = client.post(
        f"/api/v1/comments/tickets/{ticket.id}",
        headers=auth_headers,
        json={"content": "Delete comment"},
    )
    comment_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/comments/{comment_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    follow_up = client.get(
        f"/api/v1/comments/{comment_id}",
        headers=auth_headers,
    )
    assert follow_up.status_code == 404


def test_delete_comment_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 while deleting a missing comment."""
    response = client.delete(
        f"/api/v1/comments/{uuid4()}",
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
        json={
            "email": other_user.email,
            "password": "Password123!",
        },
    )
    assert response.status_code == 200

    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


def test_comment_is_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    ticket: Ticket,
) -> None:
    """A comment created in one organization is invisible to another."""
    create_response = client.post(
        f"/api/v1/comments/tickets/{ticket.id}",
        headers=auth_headers,
        json={"content": "Private to my org"},
    )
    comment_id = create_response.json()["id"]

    other_headers = _other_org_headers(client, db_session)

    get_response = client.get(
        f"/api/v1/comments/{comment_id}",
        headers=other_headers,
    )
    assert get_response.status_code == 404

    list_response = client.get(
        "/api/v1/comments",
        headers=other_headers,
    )
    assert all(
        item["id"] != comment_id for item in list_response.json()["items"]
    )


def test_update_comment_rejects_non_author(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    organization: Organization,
    ticket: Ticket,
) -> None:
    """A different user in the same organization cannot edit the comment."""
    create_response = client.post(
        f"/api/v1/comments/tickets/{ticket.id}",
        headers=auth_headers,
        json={"content": "Only I can edit this"},
    )
    comment_id = create_response.json()["id"]

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
        f"/api/v1/comments/{comment_id}",
        headers=teammate_headers,
        json={"content": "Hijacked"},
    )

    assert response.status_code == 403
