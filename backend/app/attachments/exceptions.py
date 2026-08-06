"""Exceptions for the attachments module."""

from __future__ import annotations

from http import HTTPStatus

from app.core.exceptions import AppException


class AttachmentError(AppException):
    """Base exception for all attachment-related errors."""

    def __init__(
        self,
        message: str,
        status_code: HTTPStatus = HTTPStatus.BAD_REQUEST,
    ) -> None:
        """Initialize the exception."""
        super().__init__(
            message=message,
            status_code=status_code,
        )


class AttachmentNotFoundError(AttachmentError):
    """Raised when an attachment cannot be found."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(
            message="Attachment not found.",
            status_code=HTTPStatus.NOT_FOUND,
        )


class AttachmentAlreadyExistsError(AttachmentError):
    """Raised when attempting to create a duplicate attachment."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(
            message="Attachment already exists.",
            status_code=HTTPStatus.CONFLICT,
        )


class AttachmentValidationError(AttachmentError):
    """Raised when attachment validation fails."""

    def __init__(
        self,
        message: str = "Attachment validation failed.",
    ) -> None:
        """Initialize the exception."""
        super().__init__(
            message=message,
            status_code=HTTPStatus.BAD_REQUEST,
        )


class AttachmentPermissionDeniedError(AttachmentError):
    """Raised when the user is not permitted to access an attachment."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(
            message="Permission denied.",
            status_code=HTTPStatus.FORBIDDEN,
        )


class AttachmentDeletedError(AttachmentError):
    """Raised when an operation targets a deleted attachment."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(
            message="Attachment has been deleted.",
            status_code=HTTPStatus.GONE,
        )


class AttachmentTooLargeError(AttachmentValidationError):
    """Raised when an uploaded file exceeds the maximum allowed size."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(
            "Attachment exceeds the maximum allowed file size.",
        )


class UnsupportedMediaTypeError(AttachmentValidationError):
    """Raised when the uploaded file type is not supported."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(
            "Unsupported attachment media type.",
        )


class InvalidChecksumError(AttachmentValidationError):
    """Raised when checksum validation fails."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(
            "Attachment checksum validation failed.",
        )


class AttachmentStorageError(AttachmentError):
    """Raised when attachment storage operations fail."""

    def __init__(
        self,
        message: str = "Attachment storage operation failed.",
    ) -> None:
        """Initialize the exception."""
        super().__init__(
            message=message,
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )
