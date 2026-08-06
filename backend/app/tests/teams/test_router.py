"""Tests for Team router."""

from __future__ import annotations

from collections.abc import Generator
from datetime import UTC, datetime
from types import SimpleNamespace
from unittest.mock import Mock
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.auth.dependencies import get_current_user
from app.main import app
from app.models.team import Team
from app.teams.router import get_team_service
from app.teams.schemas import TeamResponse
from app.teams.service import TeamService


@pytest.fixture
def service() -> Mock:
    """Return mocked TeamService."""
    return Mock(spec=TeamService)


@pytest.fixture
def current_user() -> SimpleNamespace:
    """Return authenticated test user."""
    return SimpleNamespace(
        id=uuid4(),
        email="admin@example.com",
        is_active=True,
    )


@pytest.fixture
def client(
    service: Mock,
    current_user: SimpleNamespace,
) -> Generator[TestClient]:
    """Create API client."""
    app.dependency_overrides[get_team_service] = lambda: service

    app.dependency_overrides[get_current_user] = lambda: current_user

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()


@pytest.fixture
def team() -> Team:
    """Sample team."""
    team = Team(
        organization_id=uuid4(),
        lead_id=None,
        name="Engineering",
        code="ENG",
        description="Engineering Team",
    )

    team.id = uuid4()
    team.is_active = True
    team.created_at = datetime.now(UTC)
    team.updated_at = datetime.now(UTC)

    return team


def test_get_team(
    client: TestClient,
    service: Mock,
    team: Team,
) -> None:
    """Test GET /teams/{team_id}."""
    service.get_team.return_value = team

    response = client.get(
        f"/api/v1/teams/{team.id}",
    )

    assert response.status_code == 200

    result = TeamResponse.model_validate(
        response.json(),
    )

    assert result.id == team.id
    service.get_team.assert_called_once_with(team.id)


def test_list_teams(
    client: TestClient,
    service: Mock,
    team: Team,
) -> None:
    """Test GET organization teams."""
    service.list_teams.return_value = [team]

    response = client.get(
        f"/api/v1/teams/organization/{team.organization_id}",
    )

    assert response.status_code == 200

    payload = response.json()

    assert len(payload["items"]) == 1
    assert payload["total"] == 1

    service.list_teams.assert_called_once_with(
        team.organization_id,
    )


def test_create_team(
    client: TestClient,
    service: Mock,
    team: Team,
) -> None:
    """Test POST /teams."""
    service.create_team.return_value = team

    response = client.post(
        "/api/v1/teams",
        json={
            "organization_id": str(
                team.organization_id,
            ),
            "lead_id": None,
            "name": team.name,
            "code": team.code,
            "description": team.description,
        },
    )

    assert response.status_code == 201

    result = TeamResponse.model_validate(
        response.json(),
    )

    assert result.name == team.name

    service.create_team.assert_called_once()


def test_delete_team(
    client: TestClient,
    service: Mock,
    team: Team,
) -> None:
    """Test DELETE /teams/{team_id}."""
    response = client.delete(
        f"/api/v1/teams/{team.id}",
    )

    assert response.status_code == 204

    service.delete_team.assert_called_once_with(
        team.id,
    )
