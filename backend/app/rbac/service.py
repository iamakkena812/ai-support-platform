"""RBAC services provider."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
)
from app.models.role_permission import RolePermission
from app.models.user_role import UserRole
from app.repositories.permission import PermissionRepository
from app.repositories.role import RoleRepository
from app.repositories.role_permission import RolePermissionRepository
from app.repositories.user import UserRepository
from app.repositories.user_role import UserRoleRepository


class RBACService:
    """Service for role-based access control."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize the RBAC service.

        Args:
            session: Active SQLAlchemy database session.
        """
        self.session = session

        self.user_repository = UserRepository(session)
        self.role_repository = RoleRepository(session)
        self.permission_repository = PermissionRepository(session)
        self.user_role_repository = UserRoleRepository(session)
        self.role_permission_repository = RolePermissionRepository(session)

    def assign_role(
        self,
        user_id: UUID,
        role_id: UUID,
    ) -> UserRole:
        """Assign a role to a user."""
        user = self.user_repository.get(user_id)
        if user is None:
            raise ResourceNotFoundException(
                "User not found.",
            )

        role = self.role_repository.get(role_id)
        if role is None:
            raise ResourceNotFoundException(
                "Role not found.",
            )

        if user.organization_id != role.organization_id:
            raise ConflictException(
                "User and role belong to different organizations.",
            )

        if self.user_role_repository.has_role(
            user_id=user_id,
            role_id=role_id,
        ):
            raise ConflictException(
                "Role already assigned to user.",
            )

        assignment = UserRole(
            user_id=user_id,
            role_id=role_id,
        )

        try:
            self.user_role_repository.create(assignment)

            self.session.commit()
            self.session.refresh(assignment)

        except Exception:
            self.session.rollback()
            raise

        return assignment

    def remove_role(
        self,
        user_id: UUID,
        role_id: UUID,
    ) -> None:
        """Remove a role from a user."""
        assignment = self.user_role_repository.get_by_user_role(
            user_id=user_id,
            role_id=role_id,
        )

        if assignment is None:
            raise ResourceNotFoundException(
                "Role assignment not found.",
            )

        try:
            self.user_role_repository.delete(assignment)

            self.session.commit()

        except Exception:
            self.session.rollback()
            raise

    def grant_permission(
        self,
        role_id: UUID,
        permission_id: UUID,
    ) -> RolePermission:
        """Grant a permission to a role."""
        role = self.role_repository.get(role_id)
        if role is None:
            raise ResourceNotFoundException(
                "Role not found.",
            )

        permission = self.permission_repository.get(permission_id)
        if permission is None:
            raise ResourceNotFoundException(
                "Permission not found.",
            )

        if self.role_permission_repository.has_permission(
            role_id=role_id,
            permission_id=permission_id,
        ):
            raise ConflictException(
                "Permission already assigned to role.",
            )

        assignment = RolePermission(
            role_id=role_id,
            permission_id=permission_id,
        )

        try:
            self.role_permission_repository.create(assignment)

            self.session.commit()
            self.session.refresh(assignment)

        except Exception:
            self.session.rollback()
            raise

        return assignment

    def revoke_permission(
        self,
        role_id: UUID,
        permission_id: UUID,
    ) -> None:
        """Remove a permission from a role."""
        assignment = self.role_permission_repository.get_by_role_permission(
            role_id=role_id,
            permission_id=permission_id,
        )

        if assignment is None:
            raise ResourceNotFoundException(
                "Role permission not found.",
            )

        try:
            self.role_permission_repository.delete(assignment)

            self.session.commit()

        except Exception:
            self.session.rollback()
            raise

    def has_permission(
        self,
        user_id: UUID,
        resource: str,
        action: str,
    ) -> bool:
        """Return whether a user has the specified permission."""
        permission = self.permission_repository.get_by_resource_action(
            resource=resource,
            action=action,
        )

        if permission is None:
            return False

        user_roles = self.user_role_repository.list_by_user(
            user_id=user_id,
        )

        if not user_roles:
            return False

        for user_role in user_roles:
            if self.role_permission_repository.has_permission(
                role_id=user_role.role_id,
                permission_id=permission.id,
            ):
                return True

        return False
