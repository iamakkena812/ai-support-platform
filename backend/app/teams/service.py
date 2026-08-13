"""Business logic for Team management."""

from __future__ import annotations

from uuid import UUID

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
)
from app.models.team import Team
from app.repositories.organization import OrganizationRepository
from app.repositories.user import UserRepository
from app.teams.constants import TEAM_CODE_MAX_LENGTH, TEAM_CODE_MIN_LENGTH, TeamStatus
from app.teams.repository import TeamRepository
from app.teams.schemas import (
    CreateTeamRequest,
    TeamStatisticsResponse,
    UpdateTeamRequest,
)


class TeamService:
    """Service for Team operations."""

    def __init__(
        self,
        repository: TeamRepository,
        organization_repository: OrganizationRepository,
        user_repository: UserRepository,
    ) -> None:
        """Initialize Team service."""
        self.repository = repository
        self.organization_repository = organization_repository
        self.user_repository = user_repository

    def _generate_unique_code(
        self,
        name: str,
    ) -> str:
        """Derive a unique, short team code from its name."""
        base = "".join(
            character
            for character in name.upper()
            if character.isalnum()
        )[:TEAM_CODE_MAX_LENGTH]

        if len(base) < TEAM_CODE_MIN_LENGTH:
            base = (base + "TEAM")[:TEAM_CODE_MAX_LENGTH]

        candidate = base
        suffix = 1

        while self.repository.exists_by_code(candidate):
            suffix += 1
            suffix_text = str(suffix)
            trimmed = base[: TEAM_CODE_MAX_LENGTH - len(suffix_text)]
            candidate = f"{trimmed}{suffix_text}"

        return candidate

    def create_team(
        self,
        request: CreateTeamRequest,
        *,
        organization_id: UUID,
    ) -> Team:
        """Create a new team owned by the requesting user's organization."""
        organization = self.organization_repository.get(
            organization_id,
        )

        if organization is None:
            raise ResourceNotFoundException("Organization not found.")

        if self.repository.exists_by_name(
            organization_id,
            request.name,
        ):
            raise ConflictException("Team name already exists.")

        if request.lead_id is not None:
            lead = self.user_repository.get(
                request.lead_id,
            )

            if lead is None:
                raise ResourceNotFoundException("Lead user not found.")

        team = Team(
            organization_id=organization_id,
            lead_id=request.lead_id,
            name=request.name,
            code=self._generate_unique_code(request.name),
            description=request.description,
            status=request.status,
        )

        return self.repository.create(team)

    def get_team(
        self,
        team_id: UUID,
    ) -> Team:
        """Return a team."""
        team = self.repository.get(team_id)

        if team is None:
            raise ResourceNotFoundException("Team not found.")

        return team

    def list_teams(
        self,
        organization_id: UUID,
    ) -> list[Team]:
        """Return all teams for an organization."""
        return self.repository.list_by_organization(
            organization_id,
        )

    def list_teams_paginated(
        self,
        *,
        organization_id: UUID,
        offset: int = 0,
        limit: int = 100,
        search: str | None = None,
        status: TeamStatus | None = None,
    ) -> list[Team]:
        """Return a paginated, filtered list of teams for an organization."""
        return self.repository.list_paginated(
            organization_id=organization_id,
            offset=offset,
            limit=limit,
            search=search,
            status=status,
        )

    def count_teams(
        self,
        *,
        organization_id: UUID,
        search: str | None = None,
        status: TeamStatus | None = None,
    ) -> int:
        """Return the number of teams for an organization, filtered."""
        return self.repository.count(
            organization_id=organization_id,
            search=search,
            status=status,
        )

    def update_team(
        self,
        team_id: UUID,
        request: UpdateTeamRequest,
    ) -> Team:
        """Update a team."""
        team = self.get_team(team_id)

        if request.name is not None and request.name != team.name:
            if self.repository.exists_by_name(
                team.organization_id,
                request.name,
            ):
                raise ConflictException("Team name already exists.")

            team.name = request.name

        if request.description is not None:
            team.description = request.description

        if request.status is not None:
            team.status = request.status

        if request.lead_id is not None:
            lead = self.user_repository.get(
                request.lead_id,
            )

            if lead is None:
                raise ResourceNotFoundException("Lead user not found.")

            team.lead_id = request.lead_id

        if request.is_active is not None:
            team.is_active = request.is_active

        return self.repository.update(team)

    def delete_team(
        self,
        team_id: UUID,
    ) -> None:
        """Delete a team."""
        team = self.get_team(team_id)

        self.repository.delete(team)

    def get_statistics(
        self,
        organization_id: UUID,
    ) -> TeamStatisticsResponse:
        """Return aggregate team statistics for an organization."""
        return TeamStatisticsResponse(
            total=self.repository.count(organization_id=organization_id),
            active=self.repository.count_by_status(
                organization_id,
                TeamStatus.ACTIVE,
            ),
            inactive=self.repository.count_by_status(
                organization_id,
                TeamStatus.INACTIVE,
            ),
            archived=self.repository.count_by_status(
                organization_id,
                TeamStatus.ARCHIVED,
            ),
        )
