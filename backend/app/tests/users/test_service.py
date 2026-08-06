"""Tests for the user service."""

from __future__ import annotations

from typing import cast
from unittest.mock import MagicMock, create_autospec
from uuid import uuid4

import pytest

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
from app.users.service import UserService


@pytest.fixture
def user_repository() -> MagicMock:
    """Return a mocked user repository."""
    return cast(
        MagicMock,
        create_autospec(
            UserRepository,
            instance=True,
            spec_set=True,
        ),
    )


@pytest.fixture
def organization_repository() -> MagicMock:
    """Return a mocked organization repository."""
    return cast(
        MagicMock,
        create_autospec(
            OrganizationRepository,
            instance=True,
            spec_set=True,
        ),
    )


@pytest.fixture
def service(
    user_repository: MagicMock,
    organization_repository: MagicMock,
) -> UserService:
    """Return a user service."""
    return UserService(
        user_repository=user_repository,
        organization_repository=organization_repository,
    )


@pytest.fixture
def create_request() -> CreateUserRequest:
    """Return a valid user creation request."""
    return CreateUserRequest(
        email="john@example.com",
        username="john",
        full_name="John Doe",
        password="Password@123",
        organization_id=uuid4(),
        is_active=True,
        is_superuser=False,
    )


@pytest.fixture
def user(create_request: CreateUserRequest) -> User:
    """Return a mocked user."""
    user = MagicMock(spec=User)

    user.id = uuid4()
    user.organization_id = create_request.organization_id
    user.email = create_request.email
    user.username = create_request.username
    user.full_name = create_request.full_name
    user.password_hash = "hashed-password"
    user.is_active = create_request.is_active
    user.is_superuser = create_request.is_superuser

    return user


def test_create_user_success(
    service: UserService,
    user_repository: MagicMock,
    organization_repository: MagicMock,
    create_request: CreateUserRequest,
    user: User,
) -> None:
    """Create user successfully."""
    user_repository.exists_by_email.return_value = False
    user_repository.exists_by_username.return_value = False
    organization_repository.get.return_value = MagicMock()
    user_repository.create.return_value = user

    result = service.create_user(create_request)

    assert result is user

    user_repository.exists_by_email.assert_called_once_with(
        create_request.email,
    )
    user_repository.exists_by_username.assert_called_once_with(
        create_request.username,
    )
    organization_repository.get.assert_called_once_with(
        create_request.organization_id,
    )
    user_repository.create.assert_called_once()


def test_create_user_duplicate_email(
    service: UserService,
    user_repository: MagicMock,
    create_request: CreateUserRequest,
) -> None:
    """Raise if email already exists."""
    user_repository.exists_by_email.return_value = True

    with pytest.raises(ConflictException):
        service.create_user(create_request)

    user_repository.create.assert_not_called()


def test_create_user_duplicate_username(
    service: UserService,
    user_repository: MagicMock,
    organization_repository: MagicMock,
    create_request: CreateUserRequest,
) -> None:
    """Raise if username already exists."""
    user_repository.exists_by_email.return_value = False
    user_repository.exists_by_username.return_value = True
    organization_repository.get.return_value = MagicMock()

    with pytest.raises(ConflictException):
        service.create_user(create_request)

    user_repository.create.assert_not_called()


def test_create_user_organization_not_found(
    service: UserService,
    user_repository: MagicMock,
    organization_repository: MagicMock,
    create_request: CreateUserRequest,
) -> None:
    """Raise if organization does not exist."""
    user_repository.exists_by_email.return_value = False
    user_repository.exists_by_username.return_value = False
    organization_repository.get.return_value = None

    with pytest.raises(ResourceNotFoundException):
        service.create_user(create_request)

    user_repository.create.assert_not_called()


def test_get_user_success(
    service: UserService,
    user_repository: MagicMock,
    user: User,
) -> None:
    """Return a user by identifier."""
    user_repository.get.return_value = user

    result = service.get_user(user.id)

    assert result is user
    user_repository.get.assert_called_once_with(user.id)


def test_get_user_not_found(
    service: UserService,
    user_repository: MagicMock,
) -> None:
    """Raise when the user does not exist."""
    user_repository.get.return_value = None

    with pytest.raises(ResourceNotFoundException):
        service.get_user(uuid4())


def test_list_users(
    service: UserService,
    user_repository: MagicMock,
    user: User,
) -> None:
    """Return a paginated list of users."""
    user_repository.list.return_value = [user]

    result = service.list_users()

    assert result == [user]

    user_repository.list.assert_called_once_with(
        offset=0,
        limit=100,
    )


def test_update_user_success(
    service: UserService,
    user_repository: MagicMock,
    user: User,
) -> None:
    """Update a user successfully."""
    request = UpdateUserRequest(
        full_name="Updated User",
        email="updated@example.com",
    )

    user_repository.get.return_value = user
    user_repository.exists_by_email.return_value = False
    user_repository.exists_by_username.return_value = False
    user_repository.update.return_value = user

    result = service.update_user(
        user.id,
        request,
    )

    assert result is user
    assert user.full_name == "Updated User"
    assert user.email == "updated@example.com"

    user_repository.update.assert_called_once_with(user)


def test_update_user_duplicate_email(
    service: UserService,
    user_repository: MagicMock,
    user: User,
) -> None:
    """Raise when updating to an existing email."""
    request = UpdateUserRequest(email="duplicate@example.com")

    user_repository.get.return_value = user
    user_repository.exists_by_email.return_value = True

    with pytest.raises(ConflictException):
        service.update_user(user.id, request)

    user_repository.update.assert_not_called()


def test_update_user_duplicate_username(
    service: UserService,
    user_repository: MagicMock,
    user: User,
) -> None:
    """Raise when updating to an existing username."""
    request = UpdateUserRequest(username="duplicate-user")

    user_repository.get.return_value = user
    user_repository.exists_by_email.return_value = False
    user_repository.exists_by_username.return_value = True

    with pytest.raises(ConflictException):
        service.update_user(user.id, request)

    user_repository.update.assert_not_called()


def test_delete_user_success(
    service: UserService,
    user_repository: MagicMock,
    user: User,
) -> None:
    """Soft-delete a user."""
    user_repository.get.return_value = user

    service.delete_user(user.id)

    user_repository.delete.assert_called_once_with(user)
