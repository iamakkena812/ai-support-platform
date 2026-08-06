"""User repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """Repository for user entities."""

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
            model=User,
        )

    def get_by_email(
        self,
        email: str,
    ) -> User | None:
        """Return a user by email."""
        statement = select(User).where(
            User.email == email,
            User.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def get_by_username(
        self,
        username: str,
    ) -> User | None:
        """Return a user by username."""
        statement = select(User).where(
            User.username == username,
            User.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def exists_by_email(
        self,
        email: str,
    ) -> bool:
        """Return whether a user exists with the given email."""
        return self.get_by_email(email) is not None

    def exists_by_username(
        self,
        username: str,
    ) -> bool:
        """Return whether a user exists with the given username."""
        return self.get_by_username(username) is not None

    def create(
        self,
        entity: User,
    ) -> User:
        """Create a new user.

        Args:
            entity: User entity.

        Returns:
            Persisted user.
        """
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)

        return entity

    def list(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[User]:
        """Return active users."""
        statement = (
            select(User).where(User.is_deleted.is_(False)).offset(offset).limit(limit)
        )

        return list(self.session.scalars(statement).all())

    def get(
        self,
        user_id: UUID,
    ) -> User | None:
        """Return a user by ID."""
        statement = select(User).where(
            User.id == user_id,
            User.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def update(
        self,
        user: User,
    ) -> User:
        """Persist user updates."""
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

        return user

    def delete(
        self,
        user: User,
    ) -> None:
        """Soft-delete a user."""
        user.is_deleted = True

        self.session.add(user)
        self.session.commit()

    def count(
        self,
    ) -> int:
        """Return the number of active users."""
        statement = (
            select(func.count()).select_from(User).where(User.is_deleted.is_(False))
        )

        result = self.session.scalar(statement)

        return int(result or 0)
