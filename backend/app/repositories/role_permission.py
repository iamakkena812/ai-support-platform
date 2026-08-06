"""Role-permission repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.role_permission import RolePermission
from app.repositories.base import BaseRepository


class RolePermissionRepository(BaseRepository[RolePermission]):
    """Repository for role-permission assignments."""

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
            model=RolePermission,
        )

    def get_by_role_permission(
        self,
        role_id: UUID,
        permission_id: UUID,
    ) -> RolePermission | None:
        """Return a role-permission assignment.

        Args:
            role_id: Role identifier.
            permission_id: Permission identifier.

        Returns:
            Matching assignment if found; otherwise None.
        """
        statement = select(RolePermission).where(
            RolePermission.role_id == role_id,
            RolePermission.permission_id == permission_id,
            RolePermission.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def has_permission(
        self,
        role_id: UUID,
        permission_id: UUID,
    ) -> bool:
        """Return whether the role has the specified permission.

        Args:
            role_id: Role identifier.
            permission_id: Permission identifier.

        Returns:
            True if the assignment exists.
        """
        return (
            self.get_by_role_permission(
                role_id,
                permission_id,
            )
            is not None
        )

    def list_by_role(
        self,
        role_id: UUID,
    ) -> list[RolePermission]:
        """Return all permission assignments for a role.

        Args:
            role_id: Role identifier.

        Returns:
            List of role-permission assignments.
        """
        statement = select(RolePermission).where(
            RolePermission.role_id == role_id,
            RolePermission.is_deleted.is_(False),
        )

        return list(
            self.session.scalars(statement).all(),
        )

    def list_by_permission(
        self,
        permission_id: UUID,
    ) -> list[RolePermission]:
        """Return all role assignments for a permission.

        Args:
            permission_id: Permission identifier.

        Returns:
            List of role-permission assignments.
        """
        statement = select(RolePermission).where(
            RolePermission.permission_id == permission_id,
            RolePermission.is_deleted.is_(False),
        )

        return list(
            self.session.scalars(statement).all(),
        )

    # def list_by_role(
    #     self,
    #     role_id: UUID,
    # ) -> list[RolePermission]:
