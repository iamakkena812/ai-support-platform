"""Role-permission repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import exists, select
from sqlalchemy.orm import Session

from app.models.role_permission import RolePermission
from app.models.user_role import UserRole
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

    def user_has_permission(
        self,
        user_id: UUID,
        permission_id: UUID,
    ) -> bool:
        """Return whether any of the user's roles grant a permission.

        Args:
            user_id: User identifier.
            permission_id: Permission identifier.

        Returns:
            True if the user holds a role granting the permission.

        This runs as a single EXISTS query joining user_roles to
        role_permissions on role_id, rather than fetching every
        role assignment and checking each one individually.
        """
        statement = select(
            exists().where(
                UserRole.user_id == user_id,
                UserRole.is_deleted.is_(False),
                RolePermission.role_id == UserRole.role_id,
                RolePermission.permission_id == permission_id,
                RolePermission.is_deleted.is_(False),
            ),
        )

        return bool(self.session.scalar(statement))

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
