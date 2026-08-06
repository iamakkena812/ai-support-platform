"""Email provider implementations."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass

from app.email.models import Email


@dataclass(slots=True, frozen=True)
class EmailResult:
    """Email delivery result."""

    success: bool
    message: str | None = None
    provider_message_id: str | None = None


class BaseEmailProvider(ABC):
    """Base email provider."""

    @abstractmethod
    def send(
        self,
        email: Email,
    ) -> EmailResult:
        """Send an email."""


class SMTPEmailProvider(BaseEmailProvider):
    """SMTP email provider."""

    def send(
        self,
        email: Email,
    ) -> EmailResult:
        """Send an email using SMTP.

        This is currently a placeholder implementation.
        Replace this with smtplib or another SMTP client.
        """
        return EmailResult(
            success=True,
            message="Email sent successfully.",
            provider_message_id=None,
        )
