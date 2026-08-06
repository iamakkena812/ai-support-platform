"""Tests for TeamRepository."""

from __future__ import annotations

import pytest
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user import UserRepository


@pytest.fixture
def repository(
    db_session: Session,
) -> UserRepository:
    """Return a user repository."""
    return UserRepository(db_session)


def test_get_by_email_returns_user(
    repository: UserRepository,
    user: User,
) -> None:
    """Test retrieving a user by email."""
    result = repository.get_by_email(user.email)

    assert result is not None
    assert result.id == user.id
    assert result.email == user.email


def test_get_by_email_returns_none_for_unknown_email(
    repository: UserRepository,
) -> None:
    """Test retrieving an unknown email."""
    assert repository.get_by_email("missing@example.com") is None


def test_get_by_username_returns_user(
    repository: UserRepository,
    user: User,
) -> None:
    """Test retrieving a user by username."""
    result = repository.get_by_username(user.username)

    assert result is not None
    assert result.id == user.id
    assert result.username == user.username


def test_get_by_username_returns_none_for_unknown_username(
    repository: UserRepository,
) -> None:
    """Test retrieving an unknown username."""
    assert repository.get_by_username("unknown-user") is None


def test_exists_by_email_returns_true(
    repository: UserRepository,
    user: User,
) -> None:
    """Test exists_by_email returns True."""
    assert repository.exists_by_email(user.email)


def test_exists_by_email_returns_false(
    repository: UserRepository,
) -> None:
    """Test exists_by_email returns False."""
    assert not repository.exists_by_email("missing@example.com")


def test_exists_by_username_returns_true(
    repository: UserRepository,
    user: User,
) -> None:
    """Test exists_by_username returns True."""
    assert repository.exists_by_username(user.username)


def test_exists_by_username_returns_false(
    repository: UserRepository,
) -> None:
    """Test exists_by_username returns False."""
    assert not repository.exists_by_username("missing-user")


def test_get_by_email_ignores_deleted_user(
    db_session: Session,
    repository: UserRepository,
    user: User,
) -> None:
    """Deleted users should not be returned."""
    user.is_deleted = True
    db_session.commit()

    assert repository.get_by_email(user.email) is None


def test_get_by_username_ignores_deleted_user(
    db_session: Session,
    repository: UserRepository,
    user: User,
) -> None:
    """Deleted users should not be returned."""
    user.is_deleted = True
    db_session.commit()

    assert repository.get_by_username(user.username) is None


def test_exists_by_email_returns_false_for_deleted_user(
    db_session: Session,
    repository: UserRepository,
    user: User,
) -> None:
    """Deleted users should not exist."""
    user.is_deleted = True
    db_session.commit()

    assert not repository.exists_by_email(user.email)


def test_exists_by_username_returns_false_for_deleted_user(
    db_session: Session,
    repository: UserRepository,
    user: User,
) -> None:
    """Deleted users should not exist."""
    user.is_deleted = True
    db_session.commit()

    assert not repository.exists_by_username(user.username)
