"""Pydantic schemas for Team."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from pydantic import ConfigDict, Field

from app.core.schemas import CamelModel
from app.teams.constants import (
    TEAM_DESCRIPTION_MAX_LENGTH,
    TEAM_NAME_MAX_LENGTH,
    TEAM_NAME_MIN_LENGTH,
    TeamStatus,
)

if TYPE_CHECKING:
    from app.models.team import Team


class CreateTeamRequest(CamelModel):
    """Request schema for creating a team.

    ``organization_id`` is intentionally absent -- the organization is
    derived from the authenticated user, matching the projects/customers
    modules. ``code`` is generated server-side since the UI never
    collects one.
    """

    name: str = Field(
        min_length=TEAM_NAME_MIN_LENGTH,
        max_length=TEAM_NAME_MAX_LENGTH,
    )
    description: str | None = Field(
        default=None,
        max_length=TEAM_DESCRIPTION_MAX_LENGTH,
    )
    status: TeamStatus = TeamStatus.ACTIVE
    lead_id: UUID | None = None


class UpdateTeamRequest(CamelModel):
    """Request schema for updating a team."""

    name: str | None = Field(
        default=None,
        min_length=TEAM_NAME_MIN_LENGTH,
        max_length=TEAM_NAME_MAX_LENGTH,
    )
    description: str | None = Field(
        default=None,
        max_length=TEAM_DESCRIPTION_MAX_LENGTH,
    )
    status: TeamStatus | None = None
    lead_id: UUID | None = None
    is_active: bool | None = None


class TeamOrganizationRef(CamelModel):
    """Minimal organization reference."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str


class TeamUserRef(CamelModel):
    """Minimal user reference."""

    id: UUID
    name: str
    email: str


class TeamResponse(CamelModel):
    """Response schema for a team."""

    id: UUID
    name: str
    code: str
    description: str | None
    status: TeamStatus
    organization: TeamOrganizationRef | None
    leader: TeamUserRef | None
    members: list[TeamUserRef]
    projects: list[TeamOrganizationRef]
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_team(cls, team: Team) -> TeamResponse:
        """Build a response from a ``Team`` ORM instance.

        Built explicitly (rather than via ``model_validate``) because
        member/project assignment is not backed by persistence yet --
        Team has no membership or project-linkage tables -- and the
        leader's display name comes from ``User.full_name`` rather than
        a ``name`` attribute.
        """
        return cls(
            id=team.id,
            name=team.name,
            code=team.code,
            description=team.description,
            status=TeamStatus(team.status),
            organization=(
                TeamOrganizationRef.model_validate(team.organization)
                if team.organization is not None
                else None
            ),
            leader=(
                TeamUserRef(
                    id=team.lead.id,
                    name=team.lead.full_name,
                    email=team.lead.email,
                )
                if team.lead is not None
                else None
            ),
            members=[],
            projects=[],
            created_at=team.created_at,
            updated_at=team.updated_at,
        )


class TeamListResponse(CamelModel):
    """Response schema for listing teams."""

    items: list[TeamResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class TeamStatisticsResponse(CamelModel):
    """Team statistics response."""

    total: int
    active: int
    inactive: int
    archived: int
