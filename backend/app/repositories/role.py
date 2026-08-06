"""Role repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.role import Role
from app.repositories.base import BaseRepository


class RoleRepository(BaseRepository[Role]):
    """Repository for role entities."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize the role repository."""
        super().__init__(
            session=session,
            model=Role,
        )

    def get_by_name(
        self,
        organization_id: UUID,
        name: str,
    ) -> Role | None:
        """Return a role by its name within an organization."""
        statement = select(Role).where(
            Role.organization_id == organization_id,
            Role.name == name,
            Role.is_deleted.is_(False),
        )
        return self.session.scalar(statement)

    def exists_by_name(
        self,
        organization_id: UUID,
        name: str,
    ) -> bool:
        """Return whether a role with the given name exists."""
        return (
            self.get_by_name(
                organization_id,
                name,
            )
            is not None
        )

    def list_by_organization(
        self,
        organization_id: UUID,
    ) -> list[Role]:
        """Return all roles for an organization."""
        statement = (
            select(Role)
            .where(
                Role.organization_id == organization_id,
                Role.is_deleted.is_(False),
            )
            .order_by(Role.name.asc())
        )
        return list(
            self.session.scalars(statement).all(),
        )
