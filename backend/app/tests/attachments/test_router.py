"""Comment router tests."""

from __future__ import annotations

from typing import cast
from uuid import UUID, uuid4

from fastapi.testclient import TestClient

from app.comments.constants import CommentVisibility


def comment_payload() -> dict[str, str]:
    """Return a valid comment payload."""
    return {
        "content": "First comment",
        "visibility": CommentVisibility.INTERNAL.value,
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
) -> None:
    """Create a comment."""
    ticket_id = uuid4()

    body = create_comment(
        client,
        auth_headers,
        ticket_id,
    )

    assert body["id"]
    assert body["ticket_id"] == str(ticket_id)
    assert body["content"] == "First comment"
    assert body["visibility"] == CommentVisibility.INTERNAL.value


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

    assert isinstance(body, list)


def test_get_comment(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Retrieve a comment."""
    ticket_id = uuid4()

    created = create_comment(
        client,
        auth_headers,
        ticket_id,
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
) -> None:
    """Update a comment."""
    ticket_id = uuid4()

    created = create_comment(
        client,
        auth_headers,
        ticket_id,
    )

    response = client.put(
        f"/api/v1/comments/{created['id']}",
        headers=auth_headers,
        json={
            "content": "Updated comment",
            "visibility": CommentVisibility.PUBLIC.value,
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["content"] == "Updated comment"
    assert body["visibility"] == CommentVisibility.PUBLIC.value


def test_delete_comment(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Delete a comment."""
    ticket_id = uuid4()

    created = create_comment(
        client,
        auth_headers,
        ticket_id,
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
) -> None:
    """List comments filtered by ticket."""
    ticket_id = uuid4()

    response = client.get(
        "/api/v1/comments",
        headers=auth_headers,
        params={
            "ticket_id": str(ticket_id),
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
            "offset": 0,
            "limit": 10,
        },
    )

    assert response.status_code == 200
