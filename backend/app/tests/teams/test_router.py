"""Integration tests for the Team router."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.models.organization import Organization


def test_create_team(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
) -> None:
    """Create a team under the authenticated user's organization."""
    response = client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json={
            "name": "Engineering",
            "description": "Engineering team",
        },
    )

    assert response.status_code == 201

    body = response.json()

    assert body["name"] == "Engineering"
    assert body["status"] == "ACTIVE"
    assert body["organization"]["id"] == str(organization.id)
    assert body["members"] == []
    assert body["projects"] == []
    assert body["code"]


def test_create_team_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous team creation."""
    response = client.post(
        "/api/v1/teams",
        json={"name": "Engineering"},
    )

    assert response.status_code == 401


def test_create_team_duplicate_name(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return conflict when the team name already exists."""
    payload = {"name": "Duplicate Team"}

    first = client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json=payload,
    )
    assert first.status_code == 201

    second = client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json=payload,
    )

    assert second.status_code == 409


def test_list_teams(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List teams for the authenticated user's organization."""
    client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json={"name": "Listed Team"},
    )

    response = client.get(
        "/api/v1/teams",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert isinstance(body["items"], list)
    assert body["total"] >= 1
    assert "page" in body
    assert "pageSize" in body
    assert "totalPages" in body


def test_list_teams_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous team listing."""
    response = client.get("/api/v1/teams")

    assert response.status_code == 401


def test_list_teams_filters_by_status(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Filter teams by status."""
    create_response = client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json={"name": "Archivable Team"},
    )
    team_id = create_response.json()["id"]

    client.patch(
        f"/api/v1/teams/{team_id}",
        headers=auth_headers,
        json={"status": "ARCHIVED"},
    )

    response = client.get(
        "/api/v1/teams",
        headers=auth_headers,
        params={"status": "ARCHIVED"},
    )

    assert response.status_code == 200

    body = response.json()
    assert any(item["id"] == team_id for item in body["items"])
    assert all(item["status"] == "ARCHIVED" for item in body["items"])


def test_get_team(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return a team by id."""
    create_response = client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json={"name": "Retrievable Team"},
    )
    team_id = create_response.json()["id"]

    response = client.get(
        f"/api/v1/teams/{team_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == team_id


def test_get_team_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for a missing team."""
    response = client.get(
        f"/api/v1/teams/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_team(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Update a team."""
    create_response = client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json={"name": "Updatable Team"},
    )
    team_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/teams/{team_id}",
        headers=auth_headers,
        json={
            "name": "Updated Team",
            "description": "Updated description",
            "status": "INACTIVE",
        },
    )

    assert response.status_code == 200

    body = response.json()
    assert body["name"] == "Updated Team"
    assert body["description"] == "Updated description"
    assert body["status"] == "INACTIVE"


def test_update_team_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 while updating a missing team."""
    response = client.patch(
        f"/api/v1/teams/{uuid4()}",
        headers=auth_headers,
        json={},
    )

    assert response.status_code == 404


def test_delete_team(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Delete a team and confirm it disappears from subsequent lookups."""
    create_response = client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json={"name": "Deletable Team"},
    )
    team_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/teams/{team_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    follow_up = client.get(
        f"/api/v1/teams/{team_id}",
        headers=auth_headers,
    )
    assert follow_up.status_code == 404

    list_response = client.get(
        "/api/v1/teams",
        headers=auth_headers,
    )
    assert all(
        item["id"] != team_id for item in list_response.json()["items"]
    )


def test_delete_team_not_found(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 while deleting a missing team."""
    response = client.delete(
        f"/api/v1/teams/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_deleted_team_name_is_reusable_and_creation_succeeds(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """A soft-deleted team's name should not block reuse.

    The generated ``code`` is *not* reused (it carries a database-level
    UNIQUE constraint independent of soft-delete), but a fresh, distinct
    code must be generated rather than the create failing outright.
    """
    create_response = client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json={"name": "Reusable Name"},
    )
    team_id = create_response.json()["id"]
    first_code = create_response.json()["code"]

    client.delete(
        f"/api/v1/teams/{team_id}",
        headers=auth_headers,
    )

    second_response = client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json={"name": "Reusable Name"},
    )

    assert second_response.status_code == 201
    assert second_response.json()["code"] != first_code


def test_team_statistics(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return aggregate team statistics."""
    client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json={"name": "Statistics Team"},
    )

    response = client.get(
        "/api/v1/teams/statistics",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()
    assert body["total"] >= 1
    assert "active" in body
    assert "inactive" in body
    assert "archived" in body


def test_list_teams_by_organization_legacy_route(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
) -> None:
    """The legacy path-param list route still works."""
    client.post(
        "/api/v1/teams",
        headers=auth_headers,
        json={"name": "Legacy Route Team"},
    )

    response = client.get(
        f"/api/v1/teams/organization/{organization.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["total"] >= 1
