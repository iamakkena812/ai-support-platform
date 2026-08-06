"""Team API router."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Response, status

from app.auth.dependencies import CurrentActiveUserDependency
from app.core.dependencies import DatabaseDependency
from app.repositories.organization import OrganizationRepository
from app.repositories.user import UserRepository
from app.teams.repository import TeamRepository
from app.teams.schemas import (
    CreateTeamRequest,
    TeamListResponse,
    TeamResponse,
    UpdateTeamRequest,
)
from app.teams.service import TeamService

router = APIRouter(
    prefix="/teams",
    tags=["Teams"],
)


def get_team_service(
    db: DatabaseDependency,
) -> TeamService:
    """Return Team service."""
    return TeamService(
        repository=TeamRepository(db),
        organization_repository=OrganizationRepository(db),
        user_repository=UserRepository(db),
    )


TeamServiceDependency = Annotated[
    TeamService,
    Depends(get_team_service),
]


@router.post(
    "",
    response_model=TeamResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create team",
)
async def create_team(
    request: CreateTeamRequest,
    _: CurrentActiveUserDependency,
    service: TeamServiceDependency,
) -> TeamResponse:
    """Create a new team."""
    team = service.create_team(request)

    return TeamResponse.model_validate(team)


@router.get(
    "/{team_id}",
    response_model=TeamResponse,
    summary="Get team",
)
async def get_team(
    team_id: UUID,
    _: CurrentActiveUserDependency,
    service: TeamServiceDependency,
) -> TeamResponse:
    """Return a team."""
    team = service.get_team(team_id)

    return TeamResponse.model_validate(team)


@router.get(
    "/organization/{organization_id}",
    response_model=TeamListResponse,
    summary="List organization teams",
)
async def list_teams(
    organization_id: UUID,
    _: CurrentActiveUserDependency,
    service: TeamServiceDependency,
) -> TeamListResponse:
    """Return organization teams."""
    teams = service.list_teams(
        organization_id,
    )

    return TeamListResponse(
        items=[TeamResponse.model_validate(team) for team in teams],
        total=len(teams),
    )


@router.patch(
    "/{team_id}",
    response_model=TeamResponse,
    summary="Update team",
)
async def update_team(
    team_id: UUID,
    request: UpdateTeamRequest,
    _: CurrentActiveUserDependency,
    service: TeamServiceDependency,
) -> TeamResponse:
    """Update a team."""
    team = service.update_team(
        team_id,
        request,
    )

    return TeamResponse.model_validate(team)


@router.delete(
    "/{team_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete team",
)
async def delete_team(
    team_id: UUID,
    _: CurrentActiveUserDependency,
    service: TeamServiceDependency,
) -> Response:
    """Delete a team."""
    service.delete_team(team_id)

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )
