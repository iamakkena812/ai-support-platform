"""Authentication service."""

from __future__ import annotations

from uuid import UUID

from app.auth.jwt import create_access_token
from app.auth.password import hash_password, verify_password
from app.models.user import User
from app.repositories.user import UserRepository


class AuthenticationError(Exception):
    """Raised when authentication fails."""


class EmailAlreadyExistsError(AuthenticationError):
    """Raised when an email is already registered."""


class UsernameAlreadyExistsError(AuthenticationError):
    """Raised when a username is already taken."""


class AuthenticationService:
    """Authentication service."""

    def __init__(
        self,
        repository: UserRepository,
    ) -> None:
        """Initialize the authentication service."""
        self._repository = repository

    def authenticate(
        self,
        email: str,
        password: str,
    ) -> str:
        """Authenticate a user and return an access token."""
        user = self._repository.get_by_email(email)

        if user is None:
            raise AuthenticationError("Invalid credentials.")

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise AuthenticationError("Invalid credentials.")

        return create_access_token(
            subject=str(user.id),
        )

    def get_user(
        self,
        email: str,
    ) -> User | None:
        """Return a user by email."""
        return self._repository.get_by_email(email)

    def register(
        self,
        *,
        email: str,
        username: str,
        password: str,
        organization_id: UUID,
        full_name: str | None = None,
    ) -> User:
        """Register a new user."""
        if self._repository.exists_by_email(email):
            raise EmailAlreadyExistsError(
                "Email is already registered.",
            )

        if self._repository.exists_by_username(username):
            raise UsernameAlreadyExistsError(
                "Username is already taken.",
            )

        password_hash = hash_password(password)

        user = User(
            email=email,
            username=username,
            full_name=full_name,
            password_hash=password_hash,
            organization_id=organization_id,
        )

        return self._repository.create(user)
