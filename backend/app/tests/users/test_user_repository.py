"""Tests for UserRepository."""

from __future__ import annotations

from uuid import UUID, uuid4

import pytest
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user import UserRepository


@pytest.fixture
def repository(
    db_session: Session,
) -> UserRepository:
    """Create a user repository."""
    return UserRepository(db_session)


def create_user(
    *,
    email: str,
    username: str,
    full_name: str,
    password_hash: str = "hashed-password",
    organization_id: UUID | None = None,
) -> User:
    """Create a test user entity."""
    return User(
        email=email,
        username=username,
        full_name=full_name,
        password_hash=password_hash,
        organization_id=organization_id or uuid4(),
    )


def test_create_user(repository: UserRepository) -> None:
    """Test creating a user."""
    user = repository.create(
        create_user(
            email="john@example.com",
            username="john",
            full_name="John Doe",
        )
    )

    assert user.id is not None
    assert user.email == "john@example.com"
    assert user.username == "john"
    assert user.full_name == "John Doe"


def test_get_by_email(repository: UserRepository) -> None:
    """Test getting a user by email."""
    repository.create(
        create_user(
            email="alice@example.com",
            username="alice",
            full_name="Alice",
        )
    )

    user = repository.get_by_email("alice@example.com")

    assert user is not None
    assert user.email == "alice@example.com"


def test_get_by_username(repository: UserRepository) -> None:
    """Test getting a user by username."""
    repository.create(
        create_user(
            email="bob@example.com",
            username="bob",
            full_name="Bob",
        )
    )

    user = repository.get_by_username("bob")

    assert user is not None
    assert user.username == "bob"


def test_exists_by_email(repository: UserRepository) -> None:
    """Test email existence."""
    repository.create(
        create_user(
            email="exists@example.com",
            username="exists",
            full_name="Exists",
        )
    )

    assert repository.exists_by_email("exists@example.com") is True
    assert repository.exists_by_email("missing@example.com") is False


def test_exists_by_username(repository: UserRepository) -> None:
    """Test username existence."""
    repository.create(
        create_user(
            email="user@example.com",
            username="existinguser",
            full_name="Existing User",
        )
    )

    assert repository.exists_by_username("existinguser") is True
    assert repository.exists_by_username("unknown") is False


def test_get_user(repository: UserRepository) -> None:
    """Test getting a user by ID."""
    created = repository.create(
        create_user(
            email="id@example.com",
            username="identifier",
            full_name="Identifier",
        )
    )

    user = repository.get(created.id)

    assert user is not None
    assert user.id == created.id


def test_list_users(repository: UserRepository) -> None:
    """Test listing users."""
    repository.create(
        create_user(
            email="one@example.com",
            username="one",
            full_name="One",
        )
    )

    repository.create(
        create_user(
            email="two@example.com",
            username="two",
            full_name="Two",
        )
    )

    users = repository.list()

    assert len(users) >= 2


def test_update_user(repository: UserRepository) -> None:
    """Test updating a user."""
    user = repository.create(
        create_user(
            email="update@example.com",
            username="update",
            full_name="Before",
        )
    )

    user.full_name = "After"

    updated = repository.update(user)

    assert updated.full_name == "After"


def test_delete_user(repository: UserRepository) -> None:
    """Test soft deleting a user."""
    user = repository.create(
        create_user(
            email="delete@example.com",
            username="delete",
            full_name="Delete",
        )
    )

    repository.delete(user)

    deleted = repository.get(user.id)

    assert deleted is None


def test_count(repository: UserRepository) -> None:
    """Test counting users."""
    count_before = repository.count()

    repository.create(
        create_user(
            email="count@example.com",
            username="count",
            full_name="Counter",
        )
    )

    count_after = repository.count()

    assert count_after == count_before + 1
