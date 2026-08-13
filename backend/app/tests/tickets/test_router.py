"""Router tests for tickets."""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.models.organization import Organization
from app.models.user import User


def test_list_tickets(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List tickets."""
    response = client.get(
        "/api/v1/tickets",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert isinstance(body["items"], list)
    assert "total" in body
    assert "page" in body
    assert "pageSize" in body
    assert "totalPages" in body


def test_create_ticket(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
    user: User,
) -> None:
    """Create a ticket."""
    response = client.post(
        "/api/v1/tickets",
        headers=auth_headers,
        json={
            "assignedTo": str(user.id),
            "title": "Router Ticket",
            "description": "Created from router test.",
            "priority": "medium",
            "status": "open",
        },
    )

    assert response.status_code == 201

    body = response.json()

    assert body["title"] == "Router Ticket"


def test_get_missing_ticket(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for a missing ticket."""
    response = client.get(
        "/api/v1/tickets/00000000-0000-0000-0000-000000000000",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_get_ticket(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
    user: User,
) -> None:
    """Return a ticket by id."""
    create_response = client.post(
        "/api/v1/tickets",
        headers=auth_headers,
        json={
            "title": "Get Ticket Router Test",
            "description": "Created from router test.",
            "priority": "medium",
            "status": "open",
        },
    )

    assert create_response.status_code == 201

    ticket_id = create_response.json()["id"]

    response = client.get(
        f"/api/v1/tickets/{ticket_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["id"] == ticket_id
    assert body["title"] == "Get Ticket Router Test"


def test_update_ticket(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
    user: User,
) -> None:
    """Update an existing ticket."""
    create_response = client.post(
        "/api/v1/tickets",
        headers=auth_headers,
        json={
            "title": "Update Ticket Router Test",
            "description": "Created from router test.",
            "priority": "medium",
            "status": "open",
        },
    )

    assert create_response.status_code == 201

    ticket_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/tickets/{ticket_id}",
        headers=auth_headers,
        json={
            "title": "Updated Router Ticket",
            "status": "resolved",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["title"] == "Updated Router Ticket"
    assert body["status"] == "resolved"


def test_delete_ticket(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
    user: User,
) -> None:
    """Delete a ticket."""
    create_response = client.post(
        "/api/v1/tickets",
        headers=auth_headers,
        json={
            "title": "Delete Ticket Router Test",
            "description": "Created from router test.",
            "priority": "medium",
            "status": "open",
        },
    )

    assert create_response.status_code == 201

    ticket_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/tickets/{ticket_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    response = client.get(
        f"/api/v1/tickets/{ticket_id}",
        headers=auth_headers,
    )

    assert response.status_code == 404
