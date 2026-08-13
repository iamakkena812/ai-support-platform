"""Business logic for the attachments module."""

from __future__ import annotations

from uuid import UUID

from app.attachments import storage
from app.attachments.constants import MAX_FILE_SIZE, SUPPORTED_MIME_TYPES
from app.attachments.exceptions import (
    AttachmentAlreadyExistsError,
    AttachmentNotFoundError,
    AttachmentParentNotFoundError,
    AttachmentPermissionDeniedError,
    AttachmentTooLargeError,
    AttachmentValidationError,
    UnsupportedMediaTypeError,
)
from app.attachments.models import Attachment
from app.attachments.repository import AttachmentRepository
from app.attachments.schemas import AttachmentUpdate
from app.comments.repository import CommentRepository
from app.tickets.repository import TicketRepository


class AttachmentService:
    """Service for attachment operations."""

    def __init__(
        self,
        repository: AttachmentRepository,
        ticket_repository: TicketRepository,
        comment_repository: CommentRepository,
    ) -> None:
        """Initialize the service."""
        self._repository = repository
        self._ticket_repository = ticket_repository
        self._comment_repository = comment_repository

    def _store_and_create(
        self,
        *,
        organization_id: UUID,
        uploaded_by_id: UUID,
        ticket_id: UUID | None,
        comment_id: UUID | None,
        original_filename: str,
        content_type: str | None,
        content: bytes,
        description: str | None,
    ) -> Attachment:
        """Validate, persist, and record a newly uploaded file."""
        if not content:
            raise AttachmentValidationError(
                "Uploaded file is empty.",
            )

        if len(content) > MAX_FILE_SIZE:
            raise AttachmentTooLargeError()

        if content_type not in SUPPORTED_MIME_TYPES:
            raise UnsupportedMediaTypeError()

        stored = storage.save_attachment(
            organization_id,
            original_filename,
            content,
        )

        if self._repository.get_by_checksum(
            stored.checksum,
            organization_id,
        ):
            storage.delete_attachment_file(stored.storage_path)
            raise AttachmentAlreadyExistsError()

        extension = (
            "." + original_filename.rsplit(".", 1)[-1]
            if "." in original_filename
            else ""
        )

        attachment = Attachment(
            organization_id=organization_id,
            ticket_id=ticket_id,
            comment_id=comment_id,
            uploaded_by_id=uploaded_by_id,
            filename=stored.filename,
            original_filename=original_filename,
            content_type=content_type,
            extension=extension,
            file_size=stored.file_size,
            storage_provider="local",
            storage_key=stored.storage_key,
            storage_path=stored.storage_path,
            checksum=stored.checksum,
            description=description,
        )

        return self._repository.create(attachment)

    def create_ticket_attachment(
        self,
        *,
        organization_id: UUID,
        uploaded_by_id: UUID,
        ticket_id: UUID,
        original_filename: str,
        content_type: str | None,
        content: bytes,
        description: str | None = None,
    ) -> Attachment:
        """Create an attachment for a ticket."""
        ticket = self._ticket_repository.get(ticket_id)

        if ticket is None or ticket.organization_id != organization_id:
            raise AttachmentParentNotFoundError("Ticket not found.")

        return self._store_and_create(
            organization_id=organization_id,
            uploaded_by_id=uploaded_by_id,
            ticket_id=ticket_id,
            comment_id=None,
            original_filename=original_filename,
            content_type=content_type,
            content=content,
            description=description,
        )

    def create_comment_attachment(
        self,
        *,
        organization_id: UUID,
        uploaded_by_id: UUID,
        comment_id: UUID,
        original_filename: str,
        content_type: str | None,
        content: bytes,
        description: str | None = None,
    ) -> Attachment:
        """Create an attachment for a comment."""
        comment = self._comment_repository.get(comment_id, organization_id)

        if comment is None:
            raise AttachmentParentNotFoundError("Comment not found.")

        return self._store_and_create(
            organization_id=organization_id,
            uploaded_by_id=uploaded_by_id,
            ticket_id=comment.ticket_id,
            comment_id=comment_id,
            original_filename=original_filename,
            content_type=content_type,
            content=content,
            description=description,
        )

    def get_attachment(
        self,
        attachment_id: UUID,
        organization_id: UUID,
    ) -> Attachment:
        """Return an attachment, scoped to its organization."""
        attachment = self._repository.get(attachment_id, organization_id)

        if attachment is None:
            raise AttachmentNotFoundError()

        return attachment

    def list_attachments(
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
    ) -> list[Attachment]:
        """Return attachments, scoped to an organization."""
        return list(
            self._repository.list(
                organization_id=organization_id,
                ticket_id=ticket_id,
                comment_id=comment_id,
                content_type=content_type,
                uploaded_by=uploaded_by,
                search=search,
                offset=offset,
                limit=limit,
            ),
        )

    def count_attachments(
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
        return self._repository.count(
            organization_id=organization_id,
            ticket_id=ticket_id,
            comment_id=comment_id,
            content_type=content_type,
            uploaded_by=uploaded_by,
            search=search,
        )

    def download_attachment(
        self,
        attachment_id: UUID,
        organization_id: UUID,
    ) -> tuple[Attachment, bytes]:
        """Return an attachment and its stored bytes."""
        attachment = self.get_attachment(attachment_id, organization_id)

        content = storage.read_attachment(attachment.storage_path)

        return attachment, content

    def update_attachment(
        self,
        attachment_id: UUID,
        organization_id: UUID,
        requesting_user_id: UUID,
        request: AttachmentUpdate,
    ) -> Attachment:
        """Update an attachment. Only the uploader may update it."""
        attachment = self.get_attachment(attachment_id, organization_id)

        if attachment.uploaded_by_id != requesting_user_id:
            raise AttachmentPermissionDeniedError()

        update_data = request.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        if "file_name" in update_data:
            attachment.original_filename = update_data["file_name"]

        if "description" in update_data:
            attachment.description = update_data["description"]

        return self._repository.update(attachment)

    def delete_attachment(
        self,
        attachment_id: UUID,
        organization_id: UUID,
        requesting_user_id: UUID,
    ) -> None:
        """Delete an attachment. Only the uploader may delete it."""
        attachment = self.get_attachment(attachment_id, organization_id)

        if attachment.uploaded_by_id != requesting_user_id:
            raise AttachmentPermissionDeniedError()

        storage_path = attachment.storage_path

        self._repository.delete(attachment)

        storage.delete_attachment_file(storage_path)
