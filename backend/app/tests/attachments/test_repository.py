"""Tests for attachment repository."""

from __future__ import annotations

from uuid import UUID, uuid4

import pytest
from sqlalchemy.orm import Session

from app.attachments.models import Attachment
from app.attachments.repository import AttachmentRepository
from app.models.organization import Organization
from app.models.ticket import Ticket
from app.models.user import User


def build_attachment(
    organization: Organization,
    *,
    ticket_id: UUID | None = None,
    uploaded_by_id: UUID | None = None,
    content_type: str = "application/pdf",
    original_filename: str = "invoice.pdf",
    checksum: str | None = None,
) -> Attachment:
    """Create a test attachment."""
    return Attachment(
        organization_id=organization.id,
        ticket_id=ticket_id or uuid4(),
        comment_id=None,
        uploaded_by_id=uploaded_by_id or uuid4(),
        filename=f"stored-{uuid4().hex}.pdf",
        original_filename=original_filename,
        content_type=content_type,
        extension=".pdf",
        file_size=1024,
        storage_provider="local",
        storage_key=f"attachments/{uuid4()}.pdf",
        storage_path="/tmp/invoice.pdf",
        checksum=checksum or str(uuid4()),
        description="Repository test file",
        is_deleted=False,
    )


@pytest.fixture
def repository(
    db_session: Session,
) -> AttachmentRepository:
    """Return attachment repository."""
    return AttachmentRepository(db_session)


def test_create_attachment(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Test creating an attachment."""
    attachment = repository.create(build_attachment(organization))

    assert attachment.id is not None
    assert attachment.original_filename == "invoice.pdf"
    assert attachment.is_deleted is False


def test_get_attachment(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Test retrieving an attachment scoped to its organization."""
    attachment = repository.create(build_attachment(organization))

    result = repository.get(attachment.id, organization.id)

    assert result is not None
    assert result.id == attachment.id


def test_get_attachment_wrong_organization_returns_none(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """An attachment is invisible outside its own organization."""
    attachment = repository.create(build_attachment(organization))

    result = repository.get(attachment.id, uuid4())

    assert result is None


def test_get_missing_attachment(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Test retrieving a missing attachment."""
    result = repository.get(uuid4(), organization.id)

    assert result is None


def test_list_attachments(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Test listing attachments scoped to an organization."""
    repository.create(build_attachment(organization))
    repository.create(build_attachment(organization))

    attachments = repository.list(organization_id=organization.id)

    assert len(attachments) >= 2


def test_list_attachments_excludes_other_organizations(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Attachments from other organizations are excluded."""
    repository.create(build_attachment(organization))

    attachments = repository.list(organization_id=uuid4())

    assert attachments == []


def test_list_by_ticket(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Test listing ticket attachments."""
    ticket_id = uuid4()

    repository.create(build_attachment(organization, ticket_id=ticket_id))
    repository.create(build_attachment(organization))

    attachments = repository.list(
        organization_id=organization.id,
        ticket_id=ticket_id,
    )

    assert len(attachments) == 1
    assert attachments[0].ticket_id == ticket_id


def test_list_filters_by_content_type(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Test filtering attachments by content type."""
    repository.create(
        build_attachment(organization, content_type="image/png"),
    )
    repository.create(
        build_attachment(organization, content_type="application/pdf"),
    )

    attachments = repository.list(
        organization_id=organization.id,
        content_type="image/png",
    )

    assert len(attachments) == 1
    assert attachments[0].content_type == "image/png"


def test_list_filters_by_search(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Test filtering attachments by filename search."""
    repository.create(
        build_attachment(organization, original_filename="quarterly-report.pdf"),
    )
    repository.create(
        build_attachment(organization, original_filename="photo.png"),
    )

    attachments = repository.list(
        organization_id=organization.id,
        search="quarterly",
    )

    assert len(attachments) == 1
    assert attachments[0].original_filename == "quarterly-report.pdf"


def test_get_by_checksum(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Test retrieving an attachment by checksum."""
    checksum = str(uuid4())

    repository.create(
        build_attachment(organization, checksum=checksum),
    )

    attachment = repository.get_by_checksum(checksum, organization.id)

    assert attachment is not None
    assert attachment.checksum == checksum


def test_get_by_checksum_scoped_to_organization(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """The same checksum in another organization does not collide."""
    checksum = str(uuid4())

    repository.create(
        build_attachment(organization, checksum=checksum),
    )

    result = repository.get_by_checksum(checksum, uuid4())

    assert result is None


def test_update_attachment(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Test updating an attachment."""
    attachment = repository.create(build_attachment(organization))

    attachment.description = "Updated description"

    updated = repository.update(attachment)

    assert updated.description == "Updated description"


def test_delete_attachment(
    repository: AttachmentRepository,
    organization: Organization,
) -> None:
    """Test soft deleting an attachment."""
    attachment = repository.create(build_attachment(organization))

    repository.delete(attachment)

    assert attachment.is_deleted is True

    result = repository.get(attachment.id, organization.id)

    assert result is None


def test_attachment_uploader_and_ticket_relationships_resolve(
    repository: AttachmentRepository,
    organization: Organization,
    user: User,
    ticket: Ticket,
) -> None:
    """The ORM relationships used to build responses resolve correctly."""
    attachment = repository.create(
        build_attachment(
            organization,
            ticket_id=ticket.id,
            uploaded_by_id=user.id,
        ),
    )

    fetched = repository.get(attachment.id, organization.id)

    assert fetched is not None
    assert fetched.uploader.id == user.id
    assert fetched.ticket is not None
    assert fetched.ticket.id == ticket.id
