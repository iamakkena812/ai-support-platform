"""Tests for EmailRepository."""

from __future__ import annotations

import uuid
from collections.abc import Callable

import pytest
from sqlalchemy.orm import Session

from app.email.constants import EmailStatus
from app.email.models import Email
from app.email.repository import EmailRepository


@pytest.fixture
def repository(
    db_session: Session,
) -> EmailRepository:
    """Return an email repository."""
    return EmailRepository(db_session)


def test_create_email(
    repository: EmailRepository,
    email_factory: Callable[..., Email],
) -> None:
    """Test creating an email."""
    email = email_factory()

    created = repository.create(email)

    assert created.id is not None
    assert created.recipient == email.recipient
    assert repository.get(created.id) is not None


def test_get_email(
    repository: EmailRepository,
    email: Email,
) -> None:
    """Test retrieving an email."""
    result = repository.get(email.id)

    assert result is not None
    assert result.id == email.id


def test_get_email_not_found(
    repository: EmailRepository,
) -> None:
    """Test retrieving an unknown email."""
    assert repository.get(uuid.uuid4()) is None


def test_list_emails(
    repository: EmailRepository,
    email: Email,
) -> None:
    """Test listing emails."""
    result = repository.list_emails()

    assert email in result


def test_list_pending(
    repository: EmailRepository,
    email: Email,
) -> None:
    """Test listing pending emails."""
    result = repository.list_pending()

    assert email in result


def test_list_failed(
    repository: EmailRepository,
    email_factory: Callable[..., Email],
) -> None:
    """Test listing failed emails."""
    failed = email_factory(
        status=EmailStatus.FAILED,
    )

    repository.create(failed)

    result = repository.list_failed()

    assert failed in result


def test_update_email(
    repository: EmailRepository,
    email: Email,
) -> None:
    """Test updating an email."""
    email.subject = "Updated Subject"

    updated = repository.update(email)

    assert updated.subject == "Updated Subject"

    refreshed = repository.get(email.id)

    assert refreshed is not None
    assert refreshed.subject == "Updated Subject"


def test_delete_email(
    repository: EmailRepository,
    email: Email,
) -> None:
    """Test soft deleting an email."""
    repository.delete(email)

    assert email.is_deleted is True
    assert repository.get(email.id) is None
