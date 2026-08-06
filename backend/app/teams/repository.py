"""Repository for Team entities."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.models.team import Team
from app.repositories.base import BaseRepository


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
        return self.session.get(Team, team_id)

    def get_by_code(self, code: str) -> Team | None:
        """Return a team by its code."""
        statement: Select[tuple[Team]] = select(Team).where(Team.code == code)
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
        )
        return self.session.execute(statement).scalar_one_or_none()

    def list_by_organization(
        self,
        organization_id: UUID,
    ) -> list[Team]:
        """Return all teams for an organization."""
        statement: Select[tuple[Team]] = (
            select(Team)
            .where(Team.organization_id == organization_id)
            .order_by(Team.name)
        )
        return list(self.session.scalars(statement).all())

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
        """Return True if a team code already exists."""
        return self.get_by_code(code) is not None
