"""Comment router tests."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.comments.constants import CommentVisibility
from app.models.organization import Organization
from app.models.user import User


def test_create_comment(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
    user: User,
) -> None:
    """Create a comment."""
    ticket_id = uuid4()

    response = client.post(
        f"/api/v1/comments/tickets/{ticket_id}",
        headers=auth_headers,
        json={
            "content": "First comment",
            "visibility": CommentVisibility.INTERNAL.value,
        },
    )

    assert response.status_code == 201

    body = response.json()

    assert body["content"] == "First comment"
    assert body["ticket_id"] == str(ticket_id)


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
    assert isinstance(response.json(), list)


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
    """Update an existing comment."""
    ticket_id = uuid4()

    create_response = client.post(
        f"/api/v1/comments/tickets/{ticket_id}",
        headers=auth_headers,
        json={
            "content": "Original comment",
            "visibility": CommentVisibility.INTERNAL.value,
        },
    )

    assert create_response.status_code == 201

    comment_id = create_response.json()["id"]

    response = client.put(
        f"/api/v1/comments/{comment_id}",
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

    create_response = client.post(
        f"/api/v1/comments/tickets/{ticket_id}",
        headers=auth_headers,
        json={
            "content": "Delete comment",
            "visibility": CommentVisibility.INTERNAL.value,
        },
    )

    assert create_response.status_code == 201

    comment_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/comments/{comment_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    response = client.get(
        f"/api/v1/comments/{comment_id}",
        headers=auth_headers,
    )

    assert response.status_code == 404
