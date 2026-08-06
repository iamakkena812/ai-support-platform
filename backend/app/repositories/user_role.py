"""User-role repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user_role import UserRole
from app.repositories.base import BaseRepository


class UserRoleRepository(BaseRepository[UserRole]):
    """Repository for user-role assignments."""

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
            model=UserRole,
        )

    def get_by_user_role(
        self,
        user_id: UUID,
        role_id: UUID,
    ) -> UserRole | None:
        """Return a user-role assignment."""
        statement = select(UserRole).where(
            UserRole.user_id == user_id,
            UserRole.role_id == role_id,
            UserRole.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def has_role(
        self,
        user_id: UUID,
        role_id: UUID,
    ) -> bool:
        """Return whether the user has the specified role."""
        return (
            self.get_by_user_role(
                user_id,
                role_id,
            )
            is not None
        )

    def list_by_user(
        self,
        user_id: UUID,
    ) -> list[UserRole]:
        """Return all role assignments for a user.

        Args:
            user_id: User identifier.

        Returns:
            List of user-role assignments.
        """
        statement = select(UserRole).where(
            UserRole.user_id == user_id,
            UserRole.is_deleted.is_(False),
        )

        return list(
            self.session.scalars(statement).all(),
        )

    def list_by_role(
        self,
        role_id: UUID,
    ) -> list[UserRole]:
        """Return all user assignments for a role.

        Args:
            role_id: Role identifier.

        Returns:
            List of user-role assignments.
        """
        statement = select(UserRole).where(
            UserRole.role_id == role_id,
            UserRole.is_deleted.is_(False),
        )

        return list(
            self.session.scalars(statement).all(),
        )
