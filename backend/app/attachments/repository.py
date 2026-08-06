"""Repository for attachment persistence."""

from __future__ import annotations

from collections.abc import Sequence
from uuid import UUID

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.attachments.models import Attachment


class AttachmentRepository:
    """Repository for attachment persistence."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize the repository."""
        self._session = session

    def _active_query(
        self,
    ) -> Select[tuple[Attachment]]:
        """Return a query for active attachments."""
        return select(Attachment).where(
            Attachment.is_deleted.is_(False),
        )

    def create(
        self,
        attachment: Attachment,
    ) -> Attachment:
        """Persist a new attachment."""
        self._session.add(attachment)
        self._session.commit()
        self._session.refresh(attachment)

        return attachment

    def get(
        self,
        attachment_id: UUID,
    ) -> Attachment | None:
        """Return an attachment by its identifier."""
        statement = self._active_query().where(
            Attachment.id == attachment_id,
        )

        return self._session.scalar(statement)

    def list_all(
        self,
    ) -> Sequence[Attachment]:
        """Return all active attachments."""
        statement = self._active_query().order_by(
            Attachment.created_at.desc(),
        )

        return self._session.scalars(statement).all()

    def list_by_ticket(
        self,
        ticket_id: UUID,
    ) -> Sequence[Attachment]:
        """Return attachments for a ticket."""
        statement = (
            self._active_query()
            .where(
                Attachment.ticket_id == ticket_id,
            )
            .order_by(
                Attachment.created_at.asc(),
            )
        )

        return self._session.scalars(statement).all()

    def list_by_comment(
        self,
        comment_id: UUID,
    ) -> Sequence[Attachment]:
        """Return attachments for a comment."""
        statement = (
            self._active_query()
            .where(
                Attachment.comment_id == comment_id,
            )
            .order_by(
                Attachment.created_at.asc(),
            )
        )

        return self._session.scalars(statement).all()

    def list_by_organization(
        self,
        organization_id: UUID,
    ) -> Sequence[Attachment]:
        """Return attachments belonging to an organization."""
        statement = (
            self._active_query()
            .where(
                Attachment.organization_id == organization_id,
            )
            .order_by(
                Attachment.created_at.desc(),
            )
        )

        return self._session.scalars(statement).all()

    def get_by_checksum(
        self,
        checksum: str,
    ) -> Attachment | None:
        """Return an attachment by checksum."""
        statement = self._active_query().where(
            Attachment.checksum == checksum,
        )

        return self._session.scalar(statement)

    def update(
        self,
        attachment: Attachment,
    ) -> Attachment:
        """Persist attachment changes."""
        self._session.add(attachment)
        self._session.commit()
        self._session.refresh(attachment)

        return attachment

    def delete(
        self,
        attachment: Attachment,
    ) -> None:
        """Soft delete an attachment."""
        if hasattr(attachment, "soft_delete"):
            attachment.soft_delete()
        else:
            attachment.is_deleted = True

        self._session.add(attachment)
        self._session.commit()
        self._session.refresh(attachment)
