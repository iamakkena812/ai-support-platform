"""Dependency injection providers for the email module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.email.providers import SMTPEmailProvider
from app.email.repository import EmailRepository
from app.email.service import EmailService


def get_email_repository(
    session: Annotated[
        Session,
        Depends(get_db),
    ],
) -> EmailRepository:
    """Return an email repository instance."""
    return EmailRepository(session)


EmailRepositoryDep = Annotated[
    EmailRepository,
    Depends(get_email_repository),
]


def get_email_provider() -> SMTPEmailProvider:
    """Return the configured email provider."""
    return SMTPEmailProvider()


EmailProviderDep = Annotated[
    SMTPEmailProvider,
    Depends(get_email_provider),
]


def get_email_service(
    repository: EmailRepositoryDep,
    provider: EmailProviderDep,
) -> EmailService:
    """Return an email service instance."""
    return EmailService(
        repository=repository,
        provider=provider,
    )


EmailServiceDep = Annotated[
    EmailService,
    Depends(get_email_service),
]
