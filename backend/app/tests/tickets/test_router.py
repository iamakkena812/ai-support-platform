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

    assert isinstance(body, list)


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
            "assigned_to": str(user.id),
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

    assert response.status_code in (
        404,
        422,
    )
