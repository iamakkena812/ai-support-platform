"""Tests for FileRepository."""

from __future__ import annotations

import uuid
from collections.abc import Callable

import pytest
from sqlalchemy.orm import Session

from app.files.models import File
from app.files.repository import FileRepository


@pytest.fixture
def repository(
    db_session: Session,
) -> FileRepository:
    """Return a file repository."""
    return FileRepository(db_session)


def test_create_file(
    repository: FileRepository,
    file_factory: Callable[..., File],
) -> None:
    """Test creating a file."""
    file = file_factory()

    created = repository.create(file)

    assert created.id is not None
    assert created.filename == file.filename
    assert repository.get(created.id) is not None


def test_get_file(
    repository: FileRepository,
    file: File,
) -> None:
    """Test retrieving a file."""
    result = repository.get(file.id)

    assert result is not None
    assert result.id == file.id


def test_get_file_not_found(
    repository: FileRepository,
) -> None:
    """Test retrieving an unknown file."""
    assert repository.get(uuid.uuid4()) is None


def test_get_by_checksum(
    repository: FileRepository,
    file: File,
) -> None:
    """Test retrieving a file by checksum."""
    result = repository.get_by_checksum(
        file.checksum,
    )

    assert result is not None
    assert result.id == file.id


def test_exists_by_checksum(
    repository: FileRepository,
    file: File,
) -> None:
    """Test checksum existence."""
    assert repository.exists_by_checksum(
        file.checksum,
    )


def test_list_files(
    repository: FileRepository,
    file: File,
) -> None:
    """Test listing files."""
    result = repository.list_files(
        offset=0,
        limit=100,
    )

    assert file in result


def test_update_file(
    repository: FileRepository,
    file: File,
) -> None:
    """Test updating a file."""
    file.filename = "updated.pdf"

    updated = repository.update(file)

    assert updated.filename == "updated.pdf"

    refreshed = repository.get(file.id)

    assert refreshed is not None
    assert refreshed.filename == "updated.pdf"


def test_delete_file(
    repository: FileRepository,
    file: File,
) -> None:
    """Test soft deleting a file."""
    repository.delete(file)

    assert file.is_deleted is True
    assert repository.get(file.id) is None
