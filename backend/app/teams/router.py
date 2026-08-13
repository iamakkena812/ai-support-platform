"""Team API router."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.auth.dependencies import CurrentActiveUserDependency
from app.core.dependencies import DatabaseDependency
from app.repositories.organization import OrganizationRepository
from app.repositories.user import UserRepository
from app.teams.constants import TeamStatus
from app.teams.repository import TeamRepository
from app.teams.schemas import (
    CreateTeamRequest,
    TeamListResponse,
    TeamResponse,
    TeamStatisticsResponse,
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
    current_user: CurrentActiveUserDependency,
    service: TeamServiceDependency,
) -> TeamResponse:
    """Create a new team owned by the requesting user's organization."""
    team = service.create_team(
        request,
        organization_id=current_user.organization_id,
    )

    return TeamResponse.from_team(team)


@router.get(
    "/statistics",
    response_model=TeamStatisticsResponse,
    summary="Team statistics",
)
async def get_team_statistics(
    current_user: CurrentActiveUserDependency,
    service: TeamServiceDependency,
) -> TeamStatisticsResponse:
    """Return aggregate team statistics for the current organization."""
    return service.get_statistics(current_user.organization_id)


@router.get(
    "",
    response_model=TeamListResponse,
    summary="List teams",
)
async def list_teams(
    current_user: CurrentActiveUserDependency,
    service: TeamServiceDependency,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100, alias="pageSize"),
    search: str | None = Query(default=None),
    status_filter: TeamStatus | None = Query(default=None, alias="status"),
) -> TeamListResponse:
    """Return a paginated, filtered list of teams for the current organization."""
    offset = (page - 1) * page_size

    teams = service.list_teams_paginated(
        organization_id=current_user.organization_id,
        offset=offset,
        limit=page_size,
        search=search,
        status=status_filter,
    )
    total = service.count_teams(
        organization_id=current_user.organization_id,
        search=search,
        status=status_filter,
    )

    return TeamListResponse(
        items=[TeamResponse.from_team(team) for team in teams],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=-(-total // page_size) if total else 0,
    )


@router.get(
    "/organization/{organization_id}",
    response_model=TeamListResponse,
    summary="List organization teams",
)
async def list_teams_by_organization(
    organization_id: UUID,
    _: CurrentActiveUserDependency,
    service: TeamServiceDependency,
) -> TeamListResponse:
    """Return all teams for an organization (unpaginated)."""
    teams = service.list_teams(
        organization_id,
    )

    return TeamListResponse(
        items=[TeamResponse.from_team(team) for team in teams],
        total=len(teams),
        page=1,
        page_size=len(teams) or 1,
        total_pages=1 if teams else 0,
    )


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

    return TeamResponse.from_team(team)


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

    return TeamResponse.from_team(team)


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
