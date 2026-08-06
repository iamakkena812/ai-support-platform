"""Email constants."""

from __future__ import annotations

from enum import StrEnum

SUBJECT_MIN_LENGTH = 3
SUBJECT_MAX_LENGTH = 255

BODY_MIN_LENGTH = 1
BODY_MAX_LENGTH = 10000

EMAIL_MAX_LENGTH = 320

MAX_RETRY_COUNT = 5


class EmailStatus(StrEnum):
    """Supported email statuses."""

    PENDING = "pending"
    QUEUED = "queued"
    SENDING = "sending"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    CANCELLED = "cancelled"


class EmailPriority(StrEnum):
    """Supported email priorities."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class EmailProvider(StrEnum):
    """Supported email providers."""

    SMTP = "smtp"
    SENDGRID = "sendgrid"
    AMAZON_SES = "amazon_ses"
    MAILGUN = "mailgun"
    AZURE = "azure"


class EmailTemplate(StrEnum):
    """Supported email templates."""

    GENERIC = "generic"
    WELCOME = "welcome"
    PASSWORD_RESET = "password_reset"
    EMAIL_VERIFICATION = "email_verification"
    INVITATION = "invitation"
    TICKET_CREATED = "ticket_created"
    TICKET_ASSIGNED = "ticket_assigned"
    TICKET_UPDATED = "ticket_updated"
    TICKET_RESOLVED = "ticket_resolved"
    COMMENT_ADDED = "comment_added"
