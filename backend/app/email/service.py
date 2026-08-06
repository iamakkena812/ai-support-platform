"""Business logic for email management."""

from __future__ import annotations

from uuid import UUID

from app.email.constants import EmailStatus
from app.email.exceptions import (
    EmailAlreadyCancelledException,
    EmailAlreadySentException,
    EmailDeliveryException,
    EmailNotFoundException,
)
from app.email.models import Email
from app.email.providers import BaseEmailProvider
from app.email.repository import EmailRepository
from app.email.schemas import (
    EmailCreate,
    EmailSearchParams,
    EmailUpdate,
)


class EmailService:
    """Service for managing emails."""

    def __init__(
        self,
        repository: EmailRepository,
        provider: BaseEmailProvider,
    ) -> None:
        """Initialize the service."""
        self._repository = repository
        self._provider = provider

    def create(
        self,
        organization_id: UUID,
        sender_id: UUID,
        request: EmailCreate,
    ) -> Email:
        """Create an email."""
        email = Email(
            organization_id=organization_id,
            sender_id=sender_id,
            recipient=str(request.recipient),
            subject=request.subject,
            body=request.body,
            cc=",".join(str(item) for item in request.cc) if request.cc else None,
            bcc=",".join(str(item) for item in request.bcc) if request.bcc else None,
            template=request.template,
            provider=request.provider,
            priority=request.priority,
            status=EmailStatus.PENDING,
        )

        return self._repository.create(email)

    def get(
        self,
        email_id: UUID,
    ) -> Email:
        """Return an email."""
        email = self._repository.get(email_id)

        if email is None:
            raise EmailNotFoundException()

        return email

    def list_emails(
        self,
        offset: int = 0,
        limit: int = 100,
    ) -> tuple[int, list[Email]]:
        """Return emails."""
        total = self._repository.count()
        emails = self._repository.list_emails(
            offset=offset,
            limit=limit,
        )

        return total, emails

    def search(
        self,
        request: EmailSearchParams,
    ) -> list[Email]:
        """Search emails."""
        if request.status is not None:
            return self._repository.list_by_status(
                request.status,
            )

        return self._repository.list_emails(
            offset=request.offset,
            limit=request.limit,
        )

    def update(
        self,
        email_id: UUID,
        request: EmailUpdate,
    ) -> Email:
        """Update an email."""
        email = self.get(email_id)

        for field, value in request.model_dump(
            exclude_unset=True,
        ).items():
            if field == "cc" and value is not None:
                value = ",".join(str(item) for item in value)

            if field == "bcc" and value is not None:
                value = ",".join(str(item) for item in value)

            setattr(email, field, value)

        return self._repository.update(email)

    def send(
        self,
        email_id: UUID,
    ) -> Email:
        """Send an email."""
        email = self.get(email_id)

        if email.status == EmailStatus.SENT:
            raise EmailAlreadySentException()

        if email.status == EmailStatus.CANCELLED:
            raise EmailAlreadyCancelledException()

        result = self._provider.send(email)

        if result.success:
            email.mark_sent()
        else:
            email.mark_failed()
            self._repository.update(email)
            raise EmailDeliveryException(
                result.message or "Email delivery failed.",
            )

        return self._repository.update(email)

    def retry(
        self,
        email_id: UUID,
    ) -> Email:
        """Retry sending an email."""
        email = self.get(email_id)

        email.status = EmailStatus.PENDING

        self._repository.update(email)

        return self.send(email.id)

    def cancel(
        self,
        email_id: UUID,
    ) -> Email:
        """Cancel an email."""
        email = self.get(email_id)

        if email.status == EmailStatus.SENT:
            raise EmailAlreadySentException()

        email.mark_cancelled()

        return self._repository.update(email)

    def delete(
        self,
        email_id: UUID,
    ) -> None:
        """Soft delete an email."""
        email = self.get(email_id)
        self._repository.delete(email)
