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
from app.teams.repository import TeamRepository
from app.teams.schemas import (
    CreateTeamRequest,
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

    def create_team(
        self,
        request: CreateTeamRequest,
    ) -> Team:
        """Create a new team."""
        organization = self.organization_repository.get(
            request.organization_id,
        )

        if organization is None:
            raise ResourceNotFoundException("Organization not found.")

        if self.repository.exists_by_name(
            request.organization_id,
            request.name,
        ):
            raise ConflictException("Team name already exists.")

        if self.repository.exists_by_code(
            request.code,
        ):
            raise ConflictException("Team code already exists.")

        if request.lead_id is not None:
            lead = self.user_repository.get(
                request.lead_id,
            )

            if lead is None:
                raise ResourceNotFoundException("Lead user not found.")

        team = Team(
            organization_id=request.organization_id,
            lead_id=request.lead_id,
            name=request.name,
            code=request.code,
            description=request.description,
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

        if request.code is not None and request.code != team.code:
            if self.repository.exists_by_code(
                request.code,
            ):
                raise ConflictException("Team code already exists.")

            team.code = request.code

        if request.description is not None:
            team.description = request.description

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
