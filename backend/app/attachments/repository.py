"""Repository for attachment persistence."""

from __future__ import annotations

from collections.abc import Sequence
from typing import Any
from uuid import UUID

from sqlalchemy import Select, func, select
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
        organization_id: UUID,
    ) -> Select[tuple[Attachment]]:
        """Return a query for active attachments in an organization."""
        return select(Attachment).where(
            Attachment.organization_id == organization_id,
            Attachment.is_deleted.is_(False),
        )

    @staticmethod
    def _apply_filters(
        statement: Select[Any],
        *,
        ticket_id: UUID | None,
        comment_id: UUID | None,
        content_type: str | None,
        uploaded_by: UUID | None,
        search: str | None,
    ) -> Select[Any]:
        """Apply shared list/count filters to a select statement."""
        if ticket_id is not None:
            statement = statement.where(Attachment.ticket_id == ticket_id)

        if comment_id is not None:
            statement = statement.where(Attachment.comment_id == comment_id)

        if content_type:
            statement = statement.where(Attachment.content_type == content_type)

        if uploaded_by is not None:
            statement = statement.where(Attachment.uploaded_by_id == uploaded_by)

        if search:
            statement = statement.where(
                Attachment.original_filename.ilike(f"%{search}%"),
            )

        return statement

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
        organization_id: UUID,
    ) -> Attachment | None:
        """Return an attachment by its identifier, scoped to its organization."""
        statement = self._active_query(organization_id).where(
            Attachment.id == attachment_id,
        )

        return self._session.scalar(statement)

    def list(
        self,
        *,
        organization_id: UUID,
        ticket_id: UUID | None = None,
        comment_id: UUID | None = None,
        content_type: str | None = None,
        uploaded_by: UUID | None = None,
        search: str | None = None,
        offset: int = 0,
        limit: int = 100,
    ) -> Sequence[Attachment]:
        """Return attachments in an organization, optionally filtered."""
        statement = self._active_query(organization_id)
        statement = self._apply_filters(
            statement,
            ticket_id=ticket_id,
            comment_id=comment_id,
            content_type=content_type,
            uploaded_by=uploaded_by,
            search=search,
        )
        statement = statement.order_by(
            Attachment.created_at.desc(),
        ).offset(offset).limit(limit)

        return self._session.scalars(statement).all()

    def count(
        self,
        *,
        organization_id: UUID,
        ticket_id: UUID | None = None,
        comment_id: UUID | None = None,
        content_type: str | None = None,
        uploaded_by: UUID | None = None,
        search: str | None = None,
    ) -> int:
        """Return the number of attachments matching the given filters."""
        statement = (
            select(func.count())
            .select_from(Attachment)
            .where(
                Attachment.organization_id == organization_id,
                Attachment.is_deleted.is_(False),
            )
        )
        statement = self._apply_filters(
            statement,
            ticket_id=ticket_id,
            comment_id=comment_id,
            content_type=content_type,
            uploaded_by=uploaded_by,
            search=search,
        )

        return int(self._session.scalar(statement) or 0)

    def get_by_checksum(
        self,
        checksum: str,
        organization_id: UUID,
    ) -> Attachment | None:
        """Return an attachment by checksum, scoped to its organization."""
        statement = self._active_query(organization_id).where(
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
        attachment.soft_delete()

        self._session.add(attachment)
        self._session.commit()
        self._session.refresh(attachment)
