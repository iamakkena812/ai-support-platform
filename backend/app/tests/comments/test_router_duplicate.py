"""Comment router tests."""

from __future__ import annotations

from typing import cast
from uuid import UUID, uuid4

from fastapi.testclient import TestClient

from app.models.ticket import Ticket


def comment_payload() -> dict[str, object]:
    """Return a valid comment payload."""
    return {
        "content": "First comment",
        "isInternal": True,
    }


def create_comment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket_id: UUID,
) -> dict[str, object]:
    """Create a comment and return the response body."""
    response = client.post(
        f"/api/v1/comments/tickets/{ticket_id}",
        headers=auth_headers,
        json=comment_payload(),
    )

    assert response.status_code == 201

    return cast(dict[str, object], response.json())


def test_create_comment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Create a comment."""
    body = create_comment(
        client,
        auth_headers,
        ticket.id,
    )

    assert body["id"]
    assert body["ticketId"] == str(ticket.id)
    assert body["content"] == "First comment"
    assert body["isInternal"] is True


def test_list_comments(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List comments."""
    response = client.get(
        "/api/v1/comments",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert isinstance(body["items"], list)


def test_get_comment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Retrieve a comment."""
    created = create_comment(
        client,
        auth_headers,
        ticket.id,
    )

    response = client.get(
        f"/api/v1/comments/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["id"] == created["id"]
    assert body["content"] == "First comment"


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
    """Update a comment."""
    created = create_comment(
        client,
        auth_headers,
        ticket.id,
    )

    response = client.put(
        f"/api/v1/comments/{created['id']}",
        headers=auth_headers,
        json={
            "content": "Updated comment",
            "isInternal": False,
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["content"] == "Updated comment"
    assert body["isInternal"] is False


def test_delete_comment(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """Delete a comment."""
    created = create_comment(
        client,
        auth_headers,
        ticket.id,
    )

    response = client.delete(
        f"/api/v1/comments/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    response = client.get(
        f"/api/v1/comments/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_list_comments_by_ticket(
    client: TestClient,
    auth_headers: dict[str, str],
    ticket: Ticket,
) -> None:
    """List comments filtered by ticket."""
    response = client.get(
        "/api/v1/comments",
        headers=auth_headers,
        params={
            "ticketId": str(ticket.id),
        },
    )

    assert response.status_code == 200


def test_list_comments_with_pagination(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List comments using pagination."""
    response = client.get(
        "/api/v1/comments",
        headers=auth_headers,
        params={
            "page": 1,
            "pageSize": 10,
        },
    )

    assert response.status_code == 200
