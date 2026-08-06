"""File management exceptions."""

from __future__ import annotations

from app.core.exceptions import (
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
)


class FileNotFoundException(ResourceNotFoundException):
    """Raised when a file cannot be found."""

    def __init__(self) -> None:
        """Initialize exception."""
        super().__init__("File")


class DuplicateFileException(ConflictException):
    """Raised when a duplicate file already exists."""

    def __init__(self) -> None:
        """Initialize exception."""
        super().__init__(
            "A file with the same checksum already exists.",
        )


class InvalidFileException(ValidationException):
    """Raised when a file is invalid."""

    def __init__(
        self,
        message: str = "Invalid file.",
    ) -> None:
        """Initialize exception."""
        super().__init__(message)


class FileStorageException(ValidationException):
    """Raised when file storage fails."""

    def __init__(
        self,
        message: str = "File storage failed.",
    ) -> None:
        """Initialize exception."""
        super().__init__(message)
