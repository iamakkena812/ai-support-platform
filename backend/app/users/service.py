"""User service."""

from __future__ import annotations

from uuid import UUID

from app.auth.password import hash_password
from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
)
from app.models.user import User
from app.organizations.repository import OrganizationRepository
from app.repositories.user import UserRepository
from app.users.schemas import (
    CreateUserRequest,
    UpdateUserRequest,
)


class UserService:
    """Service for user management."""

    def __init__(
        self,
        user_repository: UserRepository,
        organization_repository: OrganizationRepository,
    ) -> None:
        """Initialize the service.

        Args:
            user_repository: User repository.
            organization_repository: Organization repository.
        """
        self.user_repository = user_repository
        self.organization_repository = organization_repository

    def create_user(
        self,
        request: CreateUserRequest,
    ) -> User:
        """Create a new user.

        Args:
            request: User creation request.

        Returns:
            Created user.

        Raises:
            ConflictException: If email or username already exists.
            ResourceNotFoundException: If organization is not found.
        """
        if self.user_repository.exists_by_email(
            request.email,
        ):
            raise ConflictException(
                "Email already exists.",
            )

        if self.user_repository.exists_by_username(request.username):
            raise ConflictException(
                "Username already exists.",
            )

        organization = self.organization_repository.get(
            request.organization_id,
        )

        if organization is None:
            raise ResourceNotFoundException(
                "Organization not found.",
            )

        password_hash = hash_password(request.password)

        user = User(
            email=request.email,
            username=request.username,
            full_name=request.full_name,
            password_hash=password_hash,
            organization_id=request.organization_id,
        )

        user = self.user_repository.create(user)

        return user

    def get_user(
        self,
        user_id: UUID,
    ) -> User:
        """Return a user by ID."""
        user = self.user_repository.get(user_id)

        if user is None:
            raise ResourceNotFoundException(
                "User not found.",
            )

        return user

    def list_users(
        self,
        offset: int = 0,
        limit: int = 100,
    ) -> list[User]:
        """Return a paginated list of users."""
        return self.user_repository.list(
            offset=offset,
            limit=limit,
        )

    def update_user(
        self,
        user_id: UUID,
        request: UpdateUserRequest,
    ) -> User:
        """Update a user."""
        user = self.get_user(user_id)

        if (
            request.email
            and request.email != user.email
            and self.user_repository.exists_by_email(
                request.email,
            )
        ):
            raise ConflictException(
                "Email already exists.",
            )

        if (
            request.username
            and request.username != user.username
            and self.user_repository.exists_by_username(
                request.username,
            )
        ):
            raise ConflictException(
                "Username already exists.",
            )

        updates = request.model_dump(
            exclude_unset=True,
        )

        immutable_fields = frozenset(
            {
                "id",
                "organization_id",
            },
        )

        for field, value in updates.items():
            if field in immutable_fields:
                continue

            setattr(user, field, value)

        return self.user_repository.update(user)

    def delete_user(
        self,
        user_id: UUID,
    ) -> None:
        """Soft-delete a user."""
        user = self.get_user(user_id)
        self.user_repository.delete(user)
