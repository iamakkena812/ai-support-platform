"""Tests for attachment repository."""

from __future__ import annotations

from collections.abc import MutableMapping
from uuid import uuid4

import pytest
from sqlalchemy.orm import Session

from app.attachments.models import Attachment
from app.attachments.repository import AttachmentRepository


def build_attachment(
    **overrides: object,
) -> Attachment:
    """Create a test attachment."""
    data: MutableMapping[str, object] = {
        "organization_id": uuid4(),
        "ticket_id": uuid4(),
        "comment_id": None,
        "uploaded_by_id": uuid4(),
        "filename": "stored-file.pdf",
        "original_filename": "invoice.pdf",
        "content_type": "application/pdf",
        "extension": ".pdf",
        "file_size": 1024,
        "storage_provider": "local",
        "storage_key": f"attachments/{uuid4()}.pdf",
        "storage_path": "/tmp/invoice.pdf",
        "checksum": str(uuid4()),
        "description": "Repository test file",
        "is_deleted": False,
    }

    data.update(overrides)

    return Attachment(**data)


@pytest.fixture
def repository(
    db_session: Session,
) -> AttachmentRepository:
    """Return attachment repository."""
    return AttachmentRepository(db_session)


def test_create_attachment(
    repository: AttachmentRepository,
) -> None:
    """Test creating an attachment."""
    attachment = build_attachment()

    result = repository.create(attachment)

    assert result.id is not None
    assert result.filename == "stored-file.pdf"
    assert result.is_deleted is False


def test_get_attachment(
    repository: AttachmentRepository,
) -> None:
    """Test retrieving an attachment."""
    attachment = repository.create(
        build_attachment(),
    )

    result = repository.get(
        attachment.id,
    )

    assert result is not None
    assert result.id == attachment.id


def test_get_missing_attachment(
    repository: AttachmentRepository,
) -> None:
    """Test retrieving a missing attachment."""
    result = repository.get(
        uuid4(),
    )

    assert result is None


def test_list_all(
    repository: AttachmentRepository,
) -> None:
    """Test listing all attachments."""
    repository.create(
        build_attachment(),
    )

    repository.create(
        build_attachment(),
    )

    attachments = repository.list_all()

    assert len(attachments) >= 2


def test_list_by_ticket(
    repository: AttachmentRepository,
) -> None:
    """Test listing ticket attachments."""
    ticket_id = uuid4()

    repository.create(
        build_attachment(
            ticket_id=ticket_id,
        ),
    )

    repository.create(
        build_attachment(),
    )

    attachments = repository.list_by_ticket(
        ticket_id,
    )

    assert len(attachments) == 1
    assert attachments[0].ticket_id == ticket_id


def test_list_by_comment(
    repository: AttachmentRepository,
) -> None:
    """Test listing comment attachments."""
    comment_id = uuid4()

    repository.create(
        build_attachment(
            ticket_id=None,
            comment_id=comment_id,
        ),
    )

    repository.create(
        build_attachment(),
    )

    attachments = repository.list_by_comment(
        comment_id,
    )

    assert len(attachments) == 1
    assert attachments[0].comment_id == comment_id


def test_list_by_organization(
    repository: AttachmentRepository,
) -> None:
    """Test listing organization attachments."""
    organization_id = uuid4()

    repository.create(
        build_attachment(
            organization_id=organization_id,
        ),
    )

    repository.create(
        build_attachment(),
    )

    attachments = repository.list_by_organization(
        organization_id,
    )

    assert len(attachments) == 1
    assert attachments[0].organization_id == organization_id


def test_get_by_checksum(
    repository: AttachmentRepository,
) -> None:
    """Test retrieving an attachment by checksum."""
    checksum = str(uuid4())

    repository.create(
        build_attachment(
            checksum=checksum,
        ),
    )

    attachment = repository.get_by_checksum(
        checksum,
    )

    assert attachment is not None
    assert attachment.checksum == checksum


def test_update_attachment(
    repository: AttachmentRepository,
) -> None:
    """Test updating an attachment."""
    attachment = repository.create(
        build_attachment(),
    )

    attachment.description = "Updated description"

    updated = repository.update(
        attachment,
    )

    assert updated.description == "Updated description"


def test_delete_attachment(
    repository: AttachmentRepository,
) -> None:
    """Test soft deleting an attachment."""
    attachment = repository.create(
        build_attachment(),
    )

    repository.delete(
        attachment,
    )

    assert attachment.is_deleted is True

    result = repository.get(
        attachment.id,
    )

    assert result is None
