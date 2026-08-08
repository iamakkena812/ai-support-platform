"""Role repository."""

from __future__ import annotations

from math import ceil
from uuid import UUID

from sqlalchemy import ColumnElement, func, select
from sqlalchemy.orm import Session

from app.models.role import Role
from app.roles.schemas import RoleListQuery


class RoleRepository:
    """Repository for role persistence operations."""

    def __init__(self, db: Session) -> None:
        """Initialize the role repository.

        Args:
            db: Database session.
        """
        self.db = db

    def get_by_id(
        self,
        role_id: UUID,
    ) -> Role | None:
        """Return a role by identifier.

        Args:
            role_id: Role identifier.

        Returns:
            Role when found, otherwise None.
        """
        statement = select(Role).where(
            Role.id == role_id,
        )

        return self.db.scalar(statement)

    def get_by_name(
        self,
        name: str,
    ) -> Role | None:
        """Return a role by name.

        Args:
            name: Role name.

        Returns:
            Role when found, otherwise None.
        """
        statement = select(Role).where(
            Role.name == name,
        )

        return self.db.scalar(statement)

    def list(
        self,
        query: RoleListQuery,
    ) -> tuple[list[Role], int, int]:
        """Return paginated roles.

        Args:
            query: Role list query.

        Returns:
            Tuple containing roles, total records, and total pages.
        """
        filters: list[ColumnElement[bool]] = []

        if query.search:
            search = f"%{query.search}%"

            filters.append(
                Role.name.ilike(search),
            )

        if query.is_system is not None:
            filters.append(
                Role.is_system == query.is_system,
            )

        count_statement = select(
            func.count(Role.id),
        )

        if filters:
            count_statement = count_statement.where(*filters)

        total = self.db.scalar(count_statement) or 0

        total_pages = (
            ceil(total / query.page_size)
            if total > 0
            else 0
        )

        statement = (
            select(Role)
            .where(*filters)
            .order_by(Role.name)
            .offset(
                (query.page - 1) * query.page_size,
            )
            .limit(query.page_size)
        )

        items = list(
            self.db.scalars(statement).all(),
        )

        return items, total, total_pages

    def count(self) -> int:
        """Return the total number of roles.

        Returns:
            Total number of roles.
        """
        statement = select(
            func.count(Role.id),
        )

        return self.db.scalar(statement) or 0

    def count_system(self) -> int:
        """Return the number of system roles.

        Returns:
            Number of system roles.
        """
        statement = select(
            func.count(Role.id),
        ).where(
            Role.is_system.is_(True),
        )

        return self.db.scalar(statement) or 0

    def count_assigned(self) -> int:
        """Return the number of roles assigned to users.

        Returns:
            Number of roles with at least one user assignment.
        """
        statement = select(
            func.count(Role.id),
        ).where(
            Role.user_roles.any(),
        )

        return self.db.scalar(statement) or 0

    def create(
        self,
        role: Role,
    ) -> Role:
        """Persist a new role.

        Args:
            role: Role ORM instance.

        Returns:
            Persisted role.
        """
        self.db.add(role)
        self.db.flush()
        self.db.refresh(role)

        return role

    def update(
        self,
        role: Role,
    ) -> Role:
        """Persist changes to a role.

        Args:
            role: Role ORM instance.

        Returns:
            Updated role.
        """
        self.db.add(role)
        self.db.flush()
        self.db.refresh(role)

        return role

    def delete(
        self,
        role: Role,
    ) -> None:
        """Delete a role.

        Args:
            role: Role ORM instance.
        """
        self.db.delete(role)
        self.db.flush()