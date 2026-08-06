"""File validation utilities."""

from __future__ import annotations

from app.files.constants import MAX_FILE_SIZE
from app.files.exceptions import InvalidFileException


def validate_file_size(
    size: int,
) -> None:
    """Validate the file size."""
    if size > MAX_FILE_SIZE:
        raise InvalidFileException(
            "File size exceeds the maximum allowed limit.",
        )


def validate_content_type(
    content_type: str,
    allowed_content_types: set[str],
) -> None:
    """Validate the content type."""
    if content_type not in allowed_content_types:
        raise InvalidFileException(
            "Unsupported file content type.",
        )


def validate_filename(
    filename: str,
) -> None:
    """Validate the filename."""
    if not filename.strip():
        raise InvalidFileException(
            "Filename cannot be empty.",
        )
