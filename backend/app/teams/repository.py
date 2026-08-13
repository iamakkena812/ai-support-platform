"""Repository for Team entities."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from app.models.team import Team
from app.repositories.base import BaseRepository
from app.teams.constants import TeamStatus


class TeamRepository(BaseRepository[Team]):
    """Repository for Team operations."""

    model = Team

    def __init__(self, session: Session) -> None:
        """Initialize repository."""
        super().__init__(
            session=session,
            model=Team,
        )

    def get(self, team_id: UUID) -> Team | None:
        """Return a team by its identifier."""
        team = self.session.get(Team, team_id)

        if team is None or team.is_deleted:
            return None

        return team

    def get_by_code(self, code: str) -> Team | None:
        """Return a team by its code."""
        statement: Select[tuple[Team]] = select(Team).where(
            Team.code == code,
            Team.is_deleted.is_(False),
        )
        return self.session.execute(statement).scalar_one_or_none()

    def get_by_name(
        self,
        organization_id: UUID,
        name: str,
    ) -> Team | None:
        """Return a team by organization and name."""
        statement: Select[tuple[Team]] = select(Team).where(
            Team.organization_id == organization_id,
            Team.name == name,
            Team.is_deleted.is_(False),
        )
        return self.session.execute(statement).scalar_one_or_none()

    def list_by_organization(
        self,
        organization_id: UUID,
    ) -> list[Team]:
        """Return all teams for an organization."""
        statement: Select[tuple[Team]] = (
            select(Team)
            .where(
                Team.organization_id == organization_id,
                Team.is_deleted.is_(False),
            )
            .order_by(Team.name)
        )
        return list(self.session.scalars(statement).all())

    def list_paginated(
        self,
        *,
        organization_id: UUID,
        offset: int = 0,
        limit: int = 100,
        search: str | None = None,
        status: TeamStatus | None = None,
    ) -> list[Team]:
        """Return teams for an organization, paginated and filtered."""
        statement: Select[tuple[Team]] = select(Team).where(
            Team.organization_id == organization_id,
            Team.is_deleted.is_(False),
        )

        if search:
            statement = statement.where(
                Team.name.ilike(f"%{search}%"),
            )

        if status is not None:
            statement = statement.where(Team.status == status)

        statement = statement.order_by(Team.name).offset(offset).limit(limit)

        return list(self.session.scalars(statement).all())

    def count(
        self,
        *,
        organization_id: UUID,
        search: str | None = None,
        status: TeamStatus | None = None,
    ) -> int:
        """Return the number of teams for an organization, filtered."""
        statement = (
            select(func.count())
            .select_from(Team)
            .where(
                Team.organization_id == organization_id,
                Team.is_deleted.is_(False),
            )
        )

        if search:
            statement = statement.where(
                Team.name.ilike(f"%{search}%"),
            )

        if status is not None:
            statement = statement.where(Team.status == status)

        result = self.session.scalar(statement)

        return int(result or 0)

    def count_by_status(
        self,
        organization_id: UUID,
        status: TeamStatus,
    ) -> int:
        """Return the number of teams with the given status."""
        statement = (
            select(func.count())
            .select_from(Team)
            .where(
                Team.organization_id == organization_id,
                Team.is_deleted.is_(False),
                Team.status == status,
            )
        )

        result = self.session.scalar(statement)

        return int(result or 0)

    def exists_by_name(
        self,
        organization_id: UUID,
        name: str,
    ) -> bool:
        """Return True if a team name already exists."""
        return (
            self.get_by_name(
                organization_id=organization_id,
                name=name,
            )
            is not None
        )

    def exists_by_code(self, code: str) -> bool:
        """Return True if a team code already exists.

        Deliberately ignores ``is_deleted``: ``Team.code`` carries a
        database-level UNIQUE constraint that is not scoped to active
        rows, so a soft-deleted team's code is still unavailable. This
        check exists solely to predict that constraint during
        code generation (see ``TeamService._generate_unique_code``).
        """
        statement = select(Team.id).where(Team.code == code)
        return self.session.execute(statement).first() is not None
