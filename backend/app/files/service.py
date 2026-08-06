"""Business logic for file management."""

from __future__ import annotations

from uuid import UUID

from app.files.constants import FileStatus
from app.files.exceptions import (
    DuplicateFileException,
    FileNotFoundException,
)
from app.files.models import File
from app.files.providers import BaseStorageProvider
from app.files.repository import FileRepository
from app.files.schemas import (
    FileCreate,
    FileSearchParams,
    FileUpdate,
)


class FileService:
    """Service for managing files."""

    def __init__(
        self,
        repository: FileRepository,
        storage: BaseStorageProvider,
    ) -> None:
        """Initialize the service."""
        self._repository = repository
        self._storage = storage

    def create(
        self,
        organization_id: UUID,
        uploaded_by_id: UUID,
        request: FileCreate,
    ) -> File:
        """Create a new file."""
        if self._repository.exists_by_checksum(
            request.checksum,
        ):
            raise DuplicateFileException()

        storage_result = self._storage.save(
            request.filename,
            request.content,
        )

        file = File(
            organization_id=organization_id,
            uploaded_by_id=uploaded_by_id,
            filename=request.filename,
            original_filename=request.original_filename,
            content_type=request.content_type,
            size=request.size,
            checksum=request.checksum,
            provider=request.provider,
            storage_path=storage_result.storage_path or "",
            status=FileStatus.ACTIVE,
        )

        return self._repository.create(file)

    def get(
        self,
        file_id: UUID,
    ) -> File:
        """Return a file by ID."""
        file = self._repository.get(file_id)

        if file is None:
            raise FileNotFoundException()

        return file

    def list_files(
        self,
        offset: int = 0,
        limit: int = 100,
    ) -> tuple[int, list[File]]:
        """Return paginated files."""
        total = self._repository.count()

        files = self._repository.list_files(
            offset=offset,
            limit=limit,
        )

        return total, files

    def search(
        self,
        request: FileSearchParams,
    ) -> list[File]:
        """Search files."""
        return self._repository.search(request)

    def update(
        self,
        file_id: UUID,
        request: FileUpdate,
    ) -> File:
        """Update a file."""
        file = self.get(file_id)

        for field, value in request.model_dump(
            exclude_unset=True,
        ).items():
            setattr(
                file,
                field,
                value,
            )

        return self._repository.update(file)

    def delete(
        self,
        file_id: UUID,
    ) -> None:
        """Soft delete a file."""
        file = self.get(file_id)

        self._storage.delete(
            file.storage_path,
        )

        self._repository.delete(file)
