"""Tests for EmailService."""

from __future__ import annotations

from unittest.mock import MagicMock
from uuid import UUID

import pytest
from sqlalchemy.orm import Session

from app.email.constants import (
    EmailPriority,
    EmailProvider,
    EmailStatus,
    EmailTemplate,
)
from app.email.exceptions import (
    EmailAlreadyCancelledException,
    EmailAlreadySentException,
    EmailDeliveryException,
    EmailNotFoundException,
)
from app.email.models import Email
from app.email.providers import (
    BaseEmailProvider,
    EmailResult,
)
from app.email.repository import EmailRepository
from app.email.schemas import (
    EmailCreate,
    EmailSearchParams,
    EmailUpdate,
)
from app.email.service import EmailService
from app.models.organization import Organization
from app.models.user import User


@pytest.fixture
def provider() -> MagicMock:
    """Return mocked email provider."""
    return MagicMock(spec=BaseEmailProvider)


@pytest.fixture
def service(
    db_session: Session,
    provider: MagicMock,
) -> EmailService:
    """Return email service."""
    repository = EmailRepository(db_session)
    return EmailService(repository, provider)


def test_get_returns_email(
    service: EmailService,
    email: Email,
) -> None:
    """Test retrieving an email."""
    result = service.get(email.id)

    assert result.id == email.id
    assert result.subject == email.subject


def test_get_raises_not_found(
    service: EmailService,
) -> None:
    """Test retrieving unknown email."""
    with pytest.raises(EmailNotFoundException):
        service.get(
            UUID("00000000-0000-0000-0000-000000000000"),
        )


def test_create_email(
    service: EmailService,
    organization: Organization,
    user: User,
) -> None:
    """Test creating an email."""
    request = EmailCreate(
        recipient="customer@example.com",
        subject="Welcome",
        body="Welcome to our platform.",
        cc=[],
        bcc=[],
        template=EmailTemplate.GENERIC,
        provider=EmailProvider.SMTP,
        priority=EmailPriority.NORMAL,
    )

    email = service.create(
        organization_id=organization.id,
        sender_id=user.id,
        request=request,
    )

    assert email.subject == request.subject
    assert email.recipient == "customer@example.com"
    assert email.status == EmailStatus.PENDING


def test_update_email(
    service: EmailService,
    email: Email,
) -> None:
    """Test updating an email."""
    request = EmailUpdate(
        subject="Updated Subject",
        body="Updated Body",
    )

    updated = service.update(
        email.id,
        request,
    )

    assert updated.subject == "Updated Subject"
    assert updated.body == "Updated Body"


def test_send_email(
    service: EmailService,
    provider: MagicMock,
    email: Email,
) -> None:
    """Test sending an email."""
    provider.send.return_value = EmailResult(
        success=True,
        message="Sent",
        provider_message_id="msg-123",
    )

    result = service.send(email.id)

    assert result.status == EmailStatus.SENT
    assert result.sent_at is not None
    provider.send.assert_called_once_with(email)


def test_send_email_failure(
    service: EmailService,
    provider: MagicMock,
    email: Email,
) -> None:
    """Test failed email delivery."""
    provider.send.return_value = EmailResult(
        success=False,
        message="SMTP Error",
    )

    with pytest.raises(EmailDeliveryException):
        service.send(email.id)

    updated = service.get(email.id)

    assert updated.status == EmailStatus.FAILED
    assert updated.failed_at is not None


def test_retry_email(
    service: EmailService,
    provider: MagicMock,
    email: Email,
) -> None:
    """Test retrying an email."""
    email.mark_failed()
    service._repository.update(email)

    provider.send.return_value = EmailResult(
        success=True,
        message="Sent",
    )

    result = service.retry(email.id)

    assert result.status == EmailStatus.SENT
    assert result.sent_at is not None
    provider.send.assert_called_once()


def test_cancel_email(
    service: EmailService,
    email: Email,
) -> None:
    """Test cancelling an email."""
    result = service.cancel(email.id)

    assert result.status == EmailStatus.CANCELLED


def test_cancel_sent_email_raises(
    service: EmailService,
    email: Email,
) -> None:
    """Test cancelling a sent email."""
    email.mark_sent()
    service._repository.update(email)

    with pytest.raises(EmailAlreadySentException):
        service.cancel(email.id)


def test_send_cancelled_email_raises(
    service: EmailService,
    email: Email,
) -> None:
    """Test sending a cancelled email."""
    email.mark_cancelled()
    service._repository.update(email)

    with pytest.raises(EmailAlreadyCancelledException):
        service.send(email.id)


def test_send_already_sent_email_raises(
    service: EmailService,
    email: Email,
) -> None:
    """Test sending an already sent email."""
    email.mark_sent()
    service._repository.update(email)

    with pytest.raises(EmailAlreadySentException):
        service.send(email.id)


def test_delete_email(
    db_session: Session,
    service: EmailService,
    email: Email,
) -> None:
    """Test deleting an email."""
    service.delete(email.id)

    db_session.refresh(email)

    assert email.is_deleted is True


def test_search_by_status(
    service: EmailService,
    email: Email,
) -> None:
    """Test searching by status."""
    result = service.search(
        EmailSearchParams(
            status=EmailStatus.PENDING,
        ),
    )

    assert email in result


def test_search_without_filters(
    service: EmailService,
    email: Email,
) -> None:
    """Test searching without filters."""
    result = service.search(
        EmailSearchParams(),
    )

    assert email in result


def test_list_returns_emails(
    service: EmailService,
    email: Email,
) -> None:
    """Test listing emails."""
    total, emails = service.list_emails()

    assert total >= 1
    assert email in emails
