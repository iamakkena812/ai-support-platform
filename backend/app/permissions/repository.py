"""Permission repository."""

from __future__ import annotations

from math import ceil
from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.permissions.schemas import PermissionListQuery


class PermissionRepository:
    """Repository for permission persistence operations."""

    def __init__(self, db: Session) -> None:
        """Initialize the repository.

        Args:
            db: Database session.
        """
        self.db = db

    def get_by_id(self, permission_id: UUID) -> Permission | None:
        """Return a permission by identifier.

        Args:
            permission_id: Permission identifier.

        Returns:
            Permission when found, otherwise None.
        """
        statement = select(Permission).where(
            Permission.id == permission_id,
        )

        return self.db.scalar(statement)

    def get_by_resource_action(
        self,
        resource: str,
        action: str,
    ) -> Permission | None:
        """Return a permission by resource and action.

        Args:
            resource: Permission resource.
            action: Permission action.

        Returns:
            Permission when found, otherwise None.
        """
        statement = select(Permission).where(
            Permission.resource == resource,
            Permission.action == action,
        )

        return self.db.scalar(statement)

    def list(
        self,
        query: PermissionListQuery,
    ) -> tuple[list[Permission], int, int]:
        """Return paginated permissions.

        Args:
            query: Permission list and filter parameters.

        Returns:
            Tuple containing permissions, total records, and total pages.
        """
        filters = []

        if query.search:
            search = f"%{query.search}%"
            filters.append(
                or_(
                    Permission.name.ilike(search),
                    Permission.resource.ilike(search),
                    Permission.action.ilike(search),
                    Permission.description.ilike(search),
                ),
            )

        if query.resource:
            filters.append(
                Permission.resource == query.resource,
            )

        if query.action:
            filters.append(
                Permission.action == query.action,
            )

        count_statement = select(
            func.count(Permission.id),
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
            select(Permission)
            .where(*filters)
            .order_by(
                Permission.resource,
                Permission.action,
            )
            .offset(
                (query.page - 1) * query.page_size,
            )
            .limit(query.page_size)
        )

        items = list(self.db.scalars(statement).all())

        return items, total, total_pages

    def count(self) -> int:
        """Return the total number of permissions.

        Returns:
            Total permission count.
        """
        statement = select(func.count(Permission.id))
        return self.db.scalar(statement) or 0

    def count_resources(self) -> int:
        """Return the number of distinct permission resources.

        Returns:
            Number of distinct resources.
        """
        statement = select(
            func.count(
                func.distinct(Permission.resource),
            ),
        )

        return self.db.scalar(statement) or 0

    def create(self, permission: Permission) -> Permission:
        """Persist a new permission.

        Args:
            permission: Permission ORM instance.

        Returns:
            Persisted permission.
        """
        self.db.add(permission)
        self.db.flush()
        self.db.refresh(permission)

        return permission

    def update(self, permission: Permission) -> Permission:
        """Persist changes to a permission.

        Args:
            permission: Permission ORM instance.

        Returns:
            Updated permission.
        """
        self.db.add(permission)
        self.db.flush()
        self.db.refresh(permission)

        return permission

    def delete(self, permission: Permission) -> None:
        """Delete a permission.

        Args:
            permission: Permission ORM instance.
        """
        self.db.delete(permission)
        self.db.flush()