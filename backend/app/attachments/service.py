"""Business logic for the attachments module."""

from __future__ import annotations

from uuid import UUID

from app.attachments.exceptions import (
    AttachmentAlreadyExistsError,
    AttachmentNotFoundError,
)
from app.attachments.models import Attachment
from app.attachments.repository import AttachmentRepository
from app.attachments.schemas import (
    AttachmentCreate,
    AttachmentUpdate,
)


class AttachmentService:
    """Service for attachment operations."""

    def __init__(
        self,
        repository: AttachmentRepository,
    ) -> None:
        """Initialize the service."""
        self._repository = repository

    def create_attachment(
        self,
        organization_id: UUID,
        uploaded_by_id: UUID,
        request: AttachmentCreate,
    ) -> Attachment:
        """Create a new attachment."""
        duplicate = self._repository.get_by_checksum(
            request.checksum,
        )

        if duplicate is not None:
            raise AttachmentAlreadyExistsError()

        attachment = Attachment(
            organization_id=organization_id,
            ticket_id=request.ticket_id,
            comment_id=request.comment_id,
            uploaded_by_id=uploaded_by_id,
            filename=request.filename,
            original_filename=request.original_filename,
            content_type=request.content_type,
            extension=request.extension,
            file_size=request.file_size,
            storage_provider=request.storage_provider,
            storage_key=request.storage_key,
            storage_path=request.storage_path,
            checksum=request.checksum,
            description=request.description,
        )

        return self._repository.create(
            attachment,
        )

    def get_attachment(
        self,
        attachment_id: UUID,
    ) -> Attachment:
        """Return an attachment."""
        attachment = self._repository.get(
            attachment_id,
        )

        if attachment is None:
            raise AttachmentNotFoundError()

        return attachment

    def list_attachments(
        self,
    ) -> list[Attachment]:
        """Return all active attachments."""
        return list(
            self._repository.list_all(),
        )

    def list_ticket_attachments(
        self,
        ticket_id: UUID,
    ) -> list[Attachment]:
        """Return ticket attachments."""
        return list(
            self._repository.list_by_ticket(
                ticket_id,
            ),
        )

    def list_comment_attachments(
        self,
        comment_id: UUID,
    ) -> list[Attachment]:
        """Return comment attachments."""
        return list(
            self._repository.list_by_comment(
                comment_id,
            ),
        )

    def list_organization_attachments(
        self,
        organization_id: UUID,
    ) -> list[Attachment]:
        """Return organization attachments."""
        return list(
            self._repository.list_by_organization(
                organization_id,
            ),
        )

    def update_attachment(
        self,
        attachment_id: UUID,
        request: AttachmentUpdate,
    ) -> Attachment:
        """Update an attachment."""
        attachment = self.get_attachment(
            attachment_id,
        )

        if request.description is not None:
            attachment.description = request.description

        return self._repository.update(
            attachment,
        )

    def delete_attachment(
        self,
        attachment_id: UUID,
    ) -> None:
        """Soft delete an attachment."""
        attachment = self.get_attachment(
            attachment_id,
        )

        self._repository.delete(
            attachment,
        )
