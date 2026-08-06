"""File repository."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.files.models import File
from app.files.schemas import FileSearchParams


class FileRepository:
    """Repository for file persistence."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize the repository."""
        self._session = session

    def create(
        self,
        file: File,
    ) -> File:
        """Create a file."""
        self._session.add(file)
        self._session.commit()
        self._session.refresh(file)
        return file

    def get(
        self,
        file_id: UUID,
    ) -> File | None:
        """Return a file by ID."""
        statement = select(File).where(
            File.id == file_id,
            File.is_deleted.is_(False),
        )

        return self._session.scalar(statement)

    def get_by_checksum(
        self,
        checksum: str,
    ) -> File | None:
        """Return a file by checksum."""
        statement = select(File).where(
            File.checksum == checksum,
            File.is_deleted.is_(False),
        )

        return self._session.scalar(statement)

    def exists_by_checksum(
        self,
        checksum: str,
    ) -> bool:
        """Return whether a checksum already exists."""
        return self.get_by_checksum(checksum) is not None

    def list_files(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[File]:
        """Return a paginated list of files."""
        statement = (
            select(File).where(File.is_deleted.is_(False)).offset(offset).limit(limit)
        )

        return list(
            self._session.scalars(statement).all(),
        )

    def search(
        self,
        request: FileSearchParams,
    ) -> list[File]:
        """Search files."""
        statement = select(File).where(
            File.is_deleted.is_(False),
        )

        if request.filename:
            statement = statement.where(
                File.filename.ilike(f"%{request.filename}%"),
            )

        if request.provider:
            statement = statement.where(
                File.provider == request.provider,
            )

        if request.status:
            statement = statement.where(
                File.status == request.status,
            )

        statement = statement.offset(request.skip).limit(request.limit)

        return list(
            self._session.scalars(statement).all(),
        )

    def count(
        self,
    ) -> int:
        """Return the total number of active files."""
        statement = select(
            func.count(File.id),
        ).where(
            File.is_deleted.is_(False),
        )

        result = self._session.scalar(statement)

        return int(result or 0)

    def update(
        self,
        file: File,
    ) -> File:
        """Update a file."""
        self._session.add(file)
        self._session.commit()
        self._session.refresh(file)

        return file

    def delete(
        self,
        file: File,
    ) -> None:
        """Soft delete a file."""
        file.soft_delete()

        self._session.add(file)
        self._session.commit()
        self._session.refresh(file)
