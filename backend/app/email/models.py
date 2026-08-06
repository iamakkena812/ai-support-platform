"""Email management database models."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.email.constants import (
    EmailPriority,
    EmailProvider,
    EmailStatus,
    EmailTemplate,
)


class Email(Base):
    """Email message."""

    __tablename__ = "emails"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    organization_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    sender_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=False,
        index=True,
    )

    recipient: Mapped[str] = mapped_column(
        String(320),
        nullable=False,
        index=True,
    )

    subject: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    body: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    cc: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    bcc: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    template: Mapped[EmailTemplate] = mapped_column(
        Enum(EmailTemplate),
        default=EmailTemplate.GENERIC,
        nullable=False,
    )

    provider: Mapped[EmailProvider] = mapped_column(
        Enum(EmailProvider),
        default=EmailProvider.SMTP,
        nullable=False,
    )

    priority: Mapped[EmailPriority] = mapped_column(
        Enum(EmailPriority),
        default=EmailPriority.NORMAL,
        nullable=False,
    )

    status: Mapped[EmailStatus] = mapped_column(
        Enum(EmailStatus),
        default=EmailStatus.PENDING,
        nullable=False,
        index=True,
    )

    retry_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    sent_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    delivered_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    failed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def mark_sent(self) -> None:
        """Mark the email as sent."""
        self.status = EmailStatus.SENT
        self.sent_at = datetime.now()

    def mark_delivered(self) -> None:
        """Mark the email as delivered."""
        self.status = EmailStatus.DELIVERED
        self.delivered_at = datetime.now()

    def mark_failed(self) -> None:
        """Mark the email as failed."""
        self.status = EmailStatus.FAILED
        self.failed_at = datetime.now()
        self.retry_count += 1

    def mark_cancelled(self) -> None:
        """Mark the email as cancelled."""
        self.status = EmailStatus.CANCELLED

    def soft_delete(self) -> None:
        """Soft delete the email."""
        self.is_deleted = True
