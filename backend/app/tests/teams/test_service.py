"""Tests for TeamService."""

from __future__ import annotations

from unittest.mock import Mock
from uuid import uuid4

import pytest

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
)
from app.models.team import Team
from app.teams.schemas import (
    CreateTeamRequest,
    UpdateTeamRequest,
)
from app.teams.service import TeamService


@pytest.fixture
def repository() -> Mock:
    """Return mock team repository."""
    return Mock()


@pytest.fixture
def organization_repository() -> Mock:
    """Return mock organization repository."""
    return Mock()


@pytest.fixture
def user_repository() -> Mock:
    """Return mock user repository."""
    return Mock()


@pytest.fixture
def service(
    repository: Mock,
    organization_repository: Mock,
    user_repository: Mock,
) -> TeamService:
    """Create TeamService."""
    return TeamService(
        repository=repository,
        organization_repository=organization_repository,
        user_repository=user_repository,
    )


@pytest.fixture
def team() -> Team:
    """Return sample team."""
    return Team(
        organization_id=uuid4(),
        lead_id=None,
        name="Engineering",
        code="ENG",
        description="Engineering Team",
    )


def test_get_team(
    service: TeamService,
    repository: Mock,
    team: Team,
) -> None:
    """Test get team."""
    repository.get.return_value = team

    result = service.get_team(team.id)

    assert result == team


def test_get_missing(
    service: TeamService,
    repository: Mock,
) -> None:
    """Test missing team."""
    repository.get.return_value = None

    with pytest.raises(ResourceNotFoundException):
        service.get_team(uuid4())


def test_list_teams(
    service: TeamService,
    repository: Mock,
    team: Team,
) -> None:
    """Test list teams."""
    repository.list_by_organization.return_value = [team]

    result = service.list_teams(team.organization_id)

    assert len(result) == 1
    assert result[0] == team


def test_create_team(
    service: TeamService,
    repository: Mock,
    organization_repository: Mock,
) -> None:
    """Test create team."""
    request = CreateTeamRequest(
        organization_id=uuid4(),
        name="Engineering",
        code="ENG",
    )

    organization_repository.get.return_value = object()
    repository.exists_by_name.return_value = False
    repository.exists_by_code.return_value = False
    repository.create.side_effect = lambda entity: entity

    result = service.create_team(request)

    assert result.name == "Engineering"
    assert result.code == "ENG"


def test_duplicate_name(
    service: TeamService,
    repository: Mock,
    organization_repository: Mock,
) -> None:
    """Test duplicate team name."""
    request = CreateTeamRequest(
        organization_id=uuid4(),
        name="Engineering",
        code="ENG",
    )

    organization_repository.get.return_value = object()
    repository.exists_by_name.return_value = True

    with pytest.raises(ConflictException):
        service.create_team(request)


def test_duplicate_code(
    service: TeamService,
    repository: Mock,
    organization_repository: Mock,
) -> None:
    """Test duplicate team code."""
    request = CreateTeamRequest(
        organization_id=uuid4(),
        name="Engineering",
        code="ENG",
    )

    organization_repository.get.return_value = object()
    repository.exists_by_name.return_value = False
    repository.exists_by_code.return_value = True

    with pytest.raises(ConflictException):
        service.create_team(request)


def test_missing_organization(
    service: TeamService,
    organization_repository: Mock,
) -> None:
    """Test missing organization."""
    request = CreateTeamRequest(
        organization_id=uuid4(),
        name="Engineering",
        code="ENG",
    )

    organization_repository.get.return_value = None

    with pytest.raises(ResourceNotFoundException):
        service.create_team(request)


def test_update_team(
    service: TeamService,
    repository: Mock,
    team: Team,
) -> None:
    """Test update team."""
    repository.get.return_value = team
    repository.exists_by_name.return_value = False
    repository.exists_by_code.return_value = False
    repository.update.side_effect = lambda entity: entity

    request = UpdateTeamRequest(
        description="Updated description",
    )

    result = service.update_team(
        team.id,
        request,
    )

    assert result.description == "Updated description"


def test_delete_team(
    service: TeamService,
    repository: Mock,
    team: Team,
) -> None:
    """Test delete team."""
    repository.get.return_value = team

    service.delete_team(team.id)

    repository.delete.assert_called_once_with(team)
