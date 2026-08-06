"""Tests for attachment service."""

from __future__ import annotations

from unittest.mock import Mock
from uuid import uuid4

import pytest

from app.attachments.exceptions import (
    AttachmentAlreadyExistsError,
    AttachmentNotFoundError,
)
from app.attachments.models import Attachment
from app.attachments.schemas import (
    AttachmentCreate,
    AttachmentUpdate,
)
from app.attachments.service import AttachmentService


@pytest.fixture
def repository() -> Mock:
    """Return mocked repository."""
    return Mock()


@pytest.fixture
def service(
    repository: Mock,
) -> AttachmentService:
    """Return attachment service."""
    return AttachmentService(repository)


def build_attachment() -> Attachment:
    """Build attachment model."""
    return Attachment(
        organization_id=uuid4(),
        ticket_id=uuid4(),
        comment_id=None,
        uploaded_by_id=uuid4(),
        filename="stored.pdf",
        original_filename="invoice.pdf",
        content_type="application/pdf",
        extension=".pdf",
        file_size=1024,
        storage_provider="local",
        storage_key="attachments/file.pdf",
        storage_path="/tmp/file.pdf",
        checksum=str(uuid4()),
        description="Test attachment",
    )


def build_create_request() -> AttachmentCreate:
    """Build create request."""
    return AttachmentCreate(
        filename="stored.pdf",
        original_filename="invoice.pdf",
        content_type="application/pdf",
        extension=".pdf",
        file_size=1024,
        storage_provider="local",
        storage_key="attachments/file.pdf",
        storage_path="/tmp/file.pdf",
        checksum=str(uuid4()),
        description="Test attachment",
        ticket_id=uuid4(),
        comment_id=None,
    )


def test_create_attachment(
    service: AttachmentService,
    repository: Mock,
) -> None:
    """Test creating attachment."""
    request = build_create_request()
    attachment = build_attachment()

    repository.get_by_checksum.return_value = None
    repository.create.return_value = attachment

    result = service.create_attachment(
        organization_id=uuid4(),
        uploaded_by_id=uuid4(),
        request=request,
    )

    assert result == attachment
    repository.create.assert_called_once()


def test_create_duplicate_attachment(
    service: AttachmentService,
    repository: Mock,
) -> None:
    """Test duplicate attachment."""
    repository.get_by_checksum.return_value = build_attachment()

    with pytest.raises(
        AttachmentAlreadyExistsError,
    ):
        service.create_attachment(
            organization_id=uuid4(),
            uploaded_by_id=uuid4(),
            request=build_create_request(),
        )


def test_get_attachment(
    service: AttachmentService,
    repository: Mock,
) -> None:
    """Test retrieving attachment."""
    attachment = build_attachment()

    repository.get.return_value = attachment

    result = service.get_attachment(
        attachment.id,
    )

    assert result == attachment


def test_get_attachment_not_found(
    service: AttachmentService,
    repository: Mock,
) -> None:
    """Test missing attachment."""
    repository.get.return_value = None

    with pytest.raises(
        AttachmentNotFoundError,
    ):
        service.get_attachment(
            uuid4(),
        )


def test_list_attachments(
    service: AttachmentService,
    repository: Mock,
) -> None:
    """Test listing attachments."""
    repository.list_all.return_value = [
        build_attachment(),
        build_attachment(),
    ]

    attachments = service.list_attachments()

    assert len(attachments) == 2


def test_list_ticket_attachments(
    service: AttachmentService,
    repository: Mock,
) -> None:
    """Test listing ticket attachments."""
    ticket_id = uuid4()

    repository.list_by_ticket.return_value = [
        build_attachment(),
    ]

    attachments = service.list_ticket_attachments(
        ticket_id,
    )

    assert len(attachments) == 1
    repository.list_by_ticket.assert_called_once_with(
        ticket_id,
    )


def test_list_comment_attachments(
    service: AttachmentService,
    repository: Mock,
) -> None:
    """Test listing comment attachments."""
    comment_id = uuid4()

    repository.list_by_comment.return_value = [
        build_attachment(),
    ]

    attachments = service.list_comment_attachments(
        comment_id,
    )

    assert len(attachments) == 1


def test_list_organization_attachments(
    service: AttachmentService,
    repository: Mock,
) -> None:
    """Test listing organization attachments."""
    organization_id = uuid4()

    repository.list_by_organization.return_value = [
        build_attachment(),
    ]

    attachments = service.list_organization_attachments(
        organization_id,
    )

    assert len(attachments) == 1


def test_update_attachment(
    service: AttachmentService,
    repository: Mock,
) -> None:
    """Test updating attachment."""
    attachment = build_attachment()

    repository.get.return_value = attachment
    repository.update.return_value = attachment

    result = service.update_attachment(
        attachment.id,
        AttachmentUpdate(
            description="Updated",
        ),
    )

    assert result.description == "Updated"
    repository.update.assert_called_once()


def test_delete_attachment(
    service: AttachmentService,
    repository: Mock,
) -> None:
    """Test deleting attachment."""
    attachment = build_attachment()

    repository.get.return_value = attachment

    service.delete_attachment(
        attachment.id,
    )

    repository.delete.assert_called_once_with(
        attachment,
    )
