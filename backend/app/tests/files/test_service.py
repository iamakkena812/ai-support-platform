"""Tests for FileService."""

from __future__ import annotations

from unittest.mock import MagicMock
from uuid import UUID

import pytest
from sqlalchemy.orm import Session

from app.files.constants import (
    FileCategory,
    FileProvider,
    FileStatus,
)
from app.files.exceptions import (
    DuplicateFileException,
    FileNotFoundException,
)
from app.files.models import File
from app.files.providers import StorageResult
from app.files.repository import FileRepository
from app.files.schemas import (
    FileCreate,
    FileSearchParams,
    FileUpdate,
)
from app.files.service import FileService
from app.models.organization import Organization
from app.models.user import User


@pytest.fixture
def storage() -> MagicMock:
    """Return mocked storage provider."""
    return MagicMock()


@pytest.fixture
def service(
    db_session: Session,
    storage: MagicMock,
) -> FileService:
    """Return file service."""
    repository = FileRepository(db_session)
    return FileService(
        repository,
        storage,
    )


def test_get_returns_file(
    service: FileService,
    file: File,
) -> None:
    """Test retrieving a file."""
    result = service.get(file.id)

    assert result.id == file.id
    assert result.filename == file.filename


def test_get_raises_not_found(
    service: FileService,
) -> None:
    """Test retrieving unknown file."""
    with pytest.raises(FileNotFoundException):
        service.get(
            UUID("00000000-0000-0000-0000-000000000000"),
        )


def test_create_file(
    service: FileService,
    storage: MagicMock,
    organization: Organization,
    user: User,
) -> None:
    """Test creating a file."""
    storage.save.return_value = StorageResult(
        success=True,
        storage_path="uploads/document.pdf",
    )
    request = FileCreate(
        filename="document.pdf",
        original_filename="document.pdf",
        content=b"example",
        content_type="application/pdf",
        size=7,
        checksum="abc123",
        provider=FileProvider.LOCAL,
        category=FileCategory.DOCUMENT,
    )

    file = service.create(
        organization_id=organization.id,
        uploaded_by_id=user.id,
        request=request,
    )

    assert file.filename == request.filename
    assert file.status == FileStatus.ACTIVE

    storage.save.assert_called_once()


def test_create_duplicate_file(
    service: FileService,
    storage: MagicMock,
    organization: Organization,
    user: User,
) -> None:
    """Test duplicate checksum."""
    storage.save.return_value = StorageResult(
        success=True,
        storage_path="uploads/document.pdf",
    )

    request = FileCreate(
        filename="document.pdf",
        original_filename="document.pdf",
        content=b"example",
        content_type="application/pdf",
        size=7,
        checksum="duplicate",
        provider=FileProvider.LOCAL,
        category=FileCategory.DOCUMENT,
    )

    service.create(
        organization.id,
        user.id,
        request,
    )

    with pytest.raises(DuplicateFileException):
        service.create(
            organization.id,
            user.id,
            request,
        )


def test_update_file(
    service: FileService,
    file: File,
) -> None:
    """Test updating a file."""
    request = FileUpdate(
        filename="updated.pdf",
    )

    updated = service.update(
        file.id,
        request,
    )

    assert updated.filename == "updated.pdf"


def test_delete_file(
    db_session: Session,
    service: FileService,
    storage: MagicMock,
    file: File,
) -> None:
    """Test deleting a file."""
    service.delete(file.id)

    storage.delete.assert_called_once()

    db_session.refresh(file)

    assert file.is_deleted is True


def test_search_by_checksum(
    service: FileService,
    file: File,
) -> None:
    """Test searching by checksum."""
    result = service.search(
        FileSearchParams(
            filename=file.filename,
        ),
    )

    assert file in result


def test_search_without_filters(
    service: FileService,
    file: File,
) -> None:
    """Test searching without filters."""
    result = service.search(
        FileSearchParams(),
    )

    assert file in result


def test_list_returns_files(
    service: FileService,
    file: File,
) -> None:
    """Test listing files."""
    total, files = service.list_files()

    assert total >= 1
    assert file in files
