"""Permission repository."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.repositories.base import BaseRepository


class PermissionRepository(BaseRepository[Permission]):
    """Repository for permission entities."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize the repository.

        Args:
            session: Active database session.
        """
        super().__init__(
            session=session,
            model=Permission,
        )

    def get_by_name(
        self,
        name: str,
    ) -> Permission | None:
        """Return a permission by name."""
        statement = select(Permission).where(
            Permission.name == name,
            Permission.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def exists_by_name(
        self,
        name: str,
    ) -> bool:
        """Return whether a permission exists."""
        return self.get_by_name(name) is not None

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
            Matching permission if found; otherwise None.
        """
        statement = select(Permission).where(
            Permission.resource == resource,
            Permission.action == action,
            Permission.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def exists_by_resource_action(
        self,
        resource: str,
        action: str,
    ) -> bool:
        """Return whether a permission exists.

        Args:
            resource: Permission resource.
            action: Permission action.

        Returns:
            True if the permission exists.
        """
        return (
            self.get_by_resource_action(
                resource,
                action,
            )
            is not None
        )

    def list_by_resource(
        self,
        resource: str,
    ) -> list[Permission]:
        """Return all permissions for a resource."""
        statement = (
            select(Permission)
            .where(
                Permission.resource == resource,
                Permission.is_deleted.is_(False),
            )
            .order_by(
                Permission.action.asc(),
            )
        )

        return list(
            self.session.scalars(statement).all(),
        )

    def list_all(
        self,
    ) -> list[Permission]:
        """Return all permissions."""
        statement = (
            select(Permission)
            .where(
                Permission.is_deleted.is_(False),
            )
            .order_by(
                Permission.resource.asc(),
                Permission.action.asc(),
            )
        )

        return list(
            self.session.scalars(statement).all(),
        )
