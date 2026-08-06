"""Pydantic schemas for the email module."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.email.constants import (
    BODY_MAX_LENGTH,
    BODY_MIN_LENGTH,
    EMAIL_MAX_LENGTH,
    SUBJECT_MAX_LENGTH,
    SUBJECT_MIN_LENGTH,
    EmailPriority,
    EmailProvider,
    EmailStatus,
    EmailTemplate,
)


class EmailBase(BaseModel):
    """Base email schema."""

    recipient: EmailStr = Field(
        max_length=EMAIL_MAX_LENGTH,
    )
    subject: str = Field(
        min_length=SUBJECT_MIN_LENGTH,
        max_length=SUBJECT_MAX_LENGTH,
    )
    body: str = Field(
        min_length=BODY_MIN_LENGTH,
        max_length=BODY_MAX_LENGTH,
    )
    cc: list[EmailStr] = Field(
        default_factory=list,
    )
    bcc: list[EmailStr] = Field(
        default_factory=list,
    )
    template: EmailTemplate = EmailTemplate.GENERIC
    priority: EmailPriority = EmailPriority.NORMAL
    provider: EmailProvider = EmailProvider.SMTP


class EmailCreate(EmailBase):
    """Create email request."""


class EmailUpdate(BaseModel):
    """Update email request."""

    subject: str | None = Field(
        default=None,
        min_length=SUBJECT_MIN_LENGTH,
        max_length=SUBJECT_MAX_LENGTH,
    )
    body: str | None = Field(
        default=None,
        min_length=BODY_MIN_LENGTH,
        max_length=BODY_MAX_LENGTH,
    )
    cc: list[EmailStr] | None = None
    bcc: list[EmailStr] | None = None
    template: EmailTemplate | None = None
    priority: EmailPriority | None = None
    provider: EmailProvider | None = None
    status: EmailStatus | None = None


class EmailRetryRequest(BaseModel):
    """Retry email request."""

    retry: bool = True


class EmailCancelRequest(BaseModel):
    """Cancel email request."""

    cancel: bool = True


class EmailResponse(EmailBase):
    """Email response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID
    sender_id: UUID

    status: EmailStatus

    retry_count: int

    sent_at: datetime | None
    delivered_at: datetime | None
    failed_at: datetime | None

    is_deleted: bool

    created_at: datetime
    updated_at: datetime


class EmailListResponse(BaseModel):
    """Email list response."""

    items: list[EmailResponse]
    total: int


class EmailSearchParams(BaseModel):
    """Email search parameters."""

    recipient: EmailStr | None = None
    status: EmailStatus | None = None
    provider: EmailProvider | None = None
    priority: EmailPriority | None = None
    template: EmailTemplate | None = None

    offset: int = 0
    limit: int = Field(
        default=100,
        ge=1,
        le=100,
    )
