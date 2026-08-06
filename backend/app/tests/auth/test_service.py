"""Tests for the authentication service."""

from __future__ import annotations

import pytest

from app.auth.password import (
    hash_password,
    verify_password,
)
from app.auth.service import (
    AuthenticationError,
    AuthenticationService,
    EmailAlreadyExistsError,
    UsernameAlreadyExistsError,
)
from app.models.organization import Organization
from app.models.user import User
from app.repositories.user import UserRepository


def test_authenticate_success(
    repository: UserRepository,
    user: User,
) -> None:
    """Authentication should return a JWT."""
    user.password_hash = hash_password("Password@123")
    repository.session.commit()

    service = AuthenticationService(repository)

    token = service.authenticate(
        user.email,
        "Password@123",
    )

    assert isinstance(token, str)
    assert token


def test_authenticate_unknown_email(
    repository: UserRepository,
) -> None:
    """Unknown email should fail."""
    service = AuthenticationService(repository)

    with pytest.raises(AuthenticationError):
        service.authenticate(
            "missing@example.com",
            "Password@123",
        )


def test_authenticate_wrong_password(
    repository: UserRepository,
    user: User,
) -> None:
    """Wrong password should fail."""
    user.password_hash = hash_password("Password@123")
    repository.session.commit()

    service = AuthenticationService(repository)

    with pytest.raises(AuthenticationError):
        service.authenticate(
            user.email,
            "WrongPassword",
        )


def test_register_success(
    repository: UserRepository,
    organization: Organization,
) -> None:
    """Register a new user."""
    print(f"test organization.id = {organization.id!r}")
    assert organization.id is not None

    service = AuthenticationService(repository)

    user = service.register(
        email="new@example.com",
        username="newuser",
        password="Password@123",
        full_name="New User",
        organization_id=organization.id,
    )

    assert user.email == "new@example.com"
    assert user.username == "newuser"
    assert user.full_name == "New User"

    assert verify_password(
        "Password@123",
        user.password_hash,
    )


def test_register_duplicate_email(
    repository: UserRepository,
    organization: Organization,
    user: User,
) -> None:
    """Duplicate email should fail."""
    service = AuthenticationService(repository)

    with pytest.raises(EmailAlreadyExistsError):
        service.register(
            email=user.email,
            username="anotheruser",
            password="Password@123",
            organization_id=organization.id,
        )


def test_register_duplicate_username(
    repository: UserRepository,
    organization: Organization,
    user: User,
) -> None:
    """Duplicate username should fail."""
    service = AuthenticationService(repository)

    with pytest.raises(UsernameAlreadyExistsError):
        service.register(
            email="another@example.com",
            username=user.username,
            password="Password@123",
            organization_id=organization.id,
        )
