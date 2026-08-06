"""Repository layer for emails."""

from __future__ import annotations

from typing import cast
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.email.constants import EmailStatus
from app.email.models import Email


class EmailRepository:
    """Repository for email persistence."""

    def __init__(self, session: Session) -> None:
        """Initialize repository."""
        self._session = session

    def create(
        self,
        email: Email,
    ) -> Email:
        """Create an email."""
        self._session.add(email)
        self._session.commit()
        self._session.refresh(email)
        return email

    def get(
        self,
        email_id: UUID,
    ) -> Email | None:
        """Return an email by ID."""
        statement = select(Email).where(
            Email.id == email_id,
            Email.is_deleted.is_(False),
        )

        return self._session.execute(statement).scalar_one_or_none()

    def list_emails(
        self,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Email]:
        """Return emails."""
        statement = (
            select(Email)
            .where(Email.is_deleted.is_(False))
            .order_by(
                Email.created_at.desc(),
                Email.id.desc(),
            )
            .offset(offset)
            .limit(limit)
        )

        return list(
            self._session.execute(statement).scalars().all(),
        )

    def list_by_status(
        self,
        status: EmailStatus,
    ) -> list[Email]:
        """Return emails by status."""
        statement = (
            select(Email)
            .where(
                Email.status == status,
                Email.is_deleted.is_(False),
            )
            .order_by(
                Email.created_at.desc(),
            )
        )

        return cast(
            list[Email],
            self._session.execute(statement).scalars().all(),
        )

    def list_pending(self) -> list[Email]:
        """Return pending emails."""
        return self.list_by_status(
            EmailStatus.PENDING,
        )

    def list_failed(self) -> list[Email]:
        """Return failed emails."""
        return self.list_by_status(
            EmailStatus.FAILED,
        )

    def update(
        self,
        email: Email,
    ) -> Email:
        """Update an email."""
        self._session.commit()
        self._session.refresh(email)
        return email

    def delete(
        self,
        email: Email,
    ) -> None:
        """Soft delete an email."""
        email.soft_delete()

        self._session.commit()
        self._session.refresh(email)

    def count(self) -> int:
        """Return the number of active emails."""
        statement = (
            select(func.count())
            .select_from(Email)
            .where(
                Email.is_deleted.is_(False),
            )
        )

        return int(self._session.scalar(statement) or 0)
