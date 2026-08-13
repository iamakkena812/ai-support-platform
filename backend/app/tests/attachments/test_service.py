"""Tests for attachment service."""

from __future__ import annotations

from pathlib import Path
from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.attachments.exceptions import (
    AttachmentAlreadyExistsError,
    AttachmentNotFoundError,
    AttachmentParentNotFoundError,
    AttachmentPermissionDeniedError,
    AttachmentTooLargeError,
    AttachmentValidationError,
    UnsupportedMediaTypeError,
)
from app.attachments.repository import AttachmentRepository
from app.attachments.schemas import AttachmentUpdate
from app.attachments.service import AttachmentService
from app.comments.repository import CommentRepository
from app.comments.schemas import CreateCommentRequest
from app.comments.service import CommentService
from app.config.settings import settings
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User
from app.tickets.repository import TicketRepository


@pytest.fixture(autouse=True)
def _isolated_upload_path(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Redirect attachment storage to a throwaway directory for each test."""
    monkeypatch.setattr(settings, "UPLOAD_PATH", str(tmp_path))


@pytest.fixture
def service(
    db_session: Session,
) -> AttachmentService:
    """Return attachment service wired to the test database."""
    return AttachmentService(
        AttachmentRepository(db_session),
        TicketRepository(db_session),
        CommentRepository(db_session),
    )


def test_create_ticket_attachment(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Create an attachment for an existing ticket."""
    attachment = service.create_ticket_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        ticket_id=ticket.id,
        original_filename="invoice.pdf",
        content_type="application/pdf",
        content=b"%PDF-1.4 test content",
    )

    assert attachment.id is not None
    assert attachment.ticket_id == ticket.id
    assert attachment.original_filename == "invoice.pdf"
    assert attachment.file_size == len(b"%PDF-1.4 test content")
    assert Path(attachment.storage_path).is_file()


def test_create_ticket_attachment_rejects_missing_ticket(
    service: AttachmentService,
    organization: Organization,
    user: User,
) -> None:
    """Reject an upload targeting a ticket that does not exist."""
    with pytest.raises(AttachmentParentNotFoundError):
        service.create_ticket_attachment(
            organization_id=organization.id,
            uploaded_by_id=user.id,
            ticket_id=uuid4(),
            original_filename="invoice.pdf",
            content_type="application/pdf",
            content=b"content",
        )


def test_create_ticket_attachment_rejects_ticket_from_other_organization(
    service: AttachmentService,
    user: User,
    ticket: Ticket,
) -> None:
    """Reject an upload targeting a ticket owned by another organization."""
    with pytest.raises(AttachmentParentNotFoundError):
        service.create_ticket_attachment(
            organization_id=uuid4(),
            uploaded_by_id=user.id,
            ticket_id=ticket.id,
            original_filename="invoice.pdf",
            content_type="application/pdf",
            content=b"content",
        )


def test_create_ticket_attachment_rejects_empty_file(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Reject an empty upload."""
    with pytest.raises(AttachmentValidationError):
        service.create_ticket_attachment(
            organization_id=organization.id,
            uploaded_by_id=user.id,
            ticket_id=ticket.id,
            original_filename="empty.txt",
            content_type="text/plain",
            content=b"",
        )


def test_create_ticket_attachment_rejects_oversized_file(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Reject an upload exceeding the maximum allowed size."""
    from app.attachments.constants import MAX_FILE_SIZE

    with pytest.raises(AttachmentTooLargeError):
        service.create_ticket_attachment(
            organization_id=organization.id,
            uploaded_by_id=user.id,
            ticket_id=ticket.id,
            original_filename="huge.bin",
            content_type="application/zip",
            content=b"0" * (MAX_FILE_SIZE + 1),
        )


def test_create_ticket_attachment_rejects_unsupported_media_type(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Reject an upload with an unsupported MIME type."""
    with pytest.raises(UnsupportedMediaTypeError):
        service.create_ticket_attachment(
            organization_id=organization.id,
            uploaded_by_id=user.id,
            ticket_id=ticket.id,
            original_filename="script.exe",
            content_type="application/x-msdownload",
            content=b"MZ",
        )


def test_create_ticket_attachment_rejects_duplicate_checksum(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Reject a duplicate upload with identical content in the same org."""
    service.create_ticket_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        ticket_id=ticket.id,
        original_filename="invoice.pdf",
        content_type="application/pdf",
        content=b"identical content",
    )

    with pytest.raises(AttachmentAlreadyExistsError):
        service.create_ticket_attachment(
            organization_id=organization.id,
            uploaded_by_id=user.id,
            ticket_id=ticket.id,
            original_filename="invoice-copy.pdf",
            content_type="application/pdf",
            content=b"identical content",
        )


def test_create_comment_attachment(
    service: AttachmentService,
    db_session: Session,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Create an attachment for an existing comment, inheriting its ticket."""
    comment_service = CommentService(
        CommentRepository(db_session),
        TicketRepository(db_session),
    )
    comment = comment_service.create_comment(
        organization_id=organization.id,
        author_id=user.id,
        ticket_id=ticket.id,
        request=CreateCommentRequest(content="See attached"),
    )

    attachment = service.create_comment_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        comment_id=comment.id,
        original_filename="screenshot.png",
        content_type="image/png",
        content=b"png-bytes",
    )

    assert attachment.comment_id == comment.id
    assert attachment.ticket_id == ticket.id


def test_create_comment_attachment_rejects_missing_comment(
    service: AttachmentService,
    organization: Organization,
    user: User,
) -> None:
    """Reject an upload targeting a comment that does not exist."""
    with pytest.raises(AttachmentParentNotFoundError):
        service.create_comment_attachment(
            organization_id=organization.id,
            uploaded_by_id=user.id,
            comment_id=uuid4(),
            original_filename="screenshot.png",
            content_type="image/png",
            content=b"png-bytes",
        )


def test_get_attachment(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Return an attachment scoped to its organization."""
    attachment = service.create_ticket_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        ticket_id=ticket.id,
        original_filename="invoice.pdf",
        content_type="application/pdf",
        content=b"content",
    )

    result = service.get_attachment(attachment.id, organization.id)

    assert result.id == attachment.id


def test_get_attachment_wrong_organization_not_found(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """An attachment is not visible from another organization."""
    attachment = service.create_ticket_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        ticket_id=ticket.id,
        original_filename="invoice.pdf",
        content_type="application/pdf",
        content=b"content",
    )

    with pytest.raises(AttachmentNotFoundError):
        service.get_attachment(attachment.id, uuid4())


def test_list_attachments(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Return attachments scoped to an organization."""
    service.create_ticket_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        ticket_id=ticket.id,
        original_filename="invoice.pdf",
        content_type="application/pdf",
        content=b"content",
    )

    attachments = service.list_attachments(organization_id=organization.id)

    assert len(attachments) >= 1


def test_download_attachment(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Return the stored bytes for an attachment."""
    attachment = service.create_ticket_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        ticket_id=ticket.id,
        original_filename="invoice.pdf",
        content_type="application/pdf",
        content=b"file bytes here",
    )

    result, content = service.download_attachment(attachment.id, organization.id)

    assert result.id == attachment.id
    assert content == b"file bytes here"


def test_update_attachment_as_uploader(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Update an attachment as its uploader."""
    attachment = service.create_ticket_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        ticket_id=ticket.id,
        original_filename="invoice.pdf",
        content_type="application/pdf",
        content=b"content",
    )

    updated = service.update_attachment(
        attachment.id,
        organization.id,
        user.id,
        AttachmentUpdate(file_name="renamed-invoice.pdf"),
    )

    assert updated.original_filename == "renamed-invoice.pdf"


def test_update_attachment_rejects_non_uploader(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Only the uploader may update an attachment."""
    attachment = service.create_ticket_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        ticket_id=ticket.id,
        original_filename="invoice.pdf",
        content_type="application/pdf",
        content=b"content",
    )

    with pytest.raises(AttachmentPermissionDeniedError):
        service.update_attachment(
            attachment.id,
            organization.id,
            uuid4(),
            AttachmentUpdate(file_name="hijacked.pdf"),
        )


def test_delete_attachment_as_uploader(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Delete an attachment as its uploader, removing the stored file."""
    attachment = service.create_ticket_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        ticket_id=ticket.id,
        original_filename="invoice.pdf",
        content_type="application/pdf",
        content=b"content",
    )
    storage_path = Path(attachment.storage_path)
    assert storage_path.is_file()

    service.delete_attachment(attachment.id, organization.id, user.id)

    with pytest.raises(AttachmentNotFoundError):
        service.get_attachment(attachment.id, organization.id)

    assert not storage_path.is_file()


def test_delete_attachment_rejects_non_uploader(
    service: AttachmentService,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """Only the uploader may delete an attachment."""
    attachment = service.create_ticket_attachment(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        ticket_id=ticket.id,
        original_filename="invoice.pdf",
        content_type="application/pdf",
        content=b"content",
    )

    with pytest.raises(AttachmentPermissionDeniedError):
        service.delete_attachment(attachment.id, organization.id, uuid4())
