"""Exceptions for the audit module."""

from __future__ import annotations

from http import HTTPStatus

from app.core.exceptions import AppException


class AuditError(AppException):
    """Base exception for all audit-related errors."""

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


class AuditLogNotFoundError(AuditError):
    """Raised when an audit log cannot be found."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(
            message="Audit log not found.",
            status_code=HTTPStatus.NOT_FOUND,
        )


class AuditLogValidationError(AuditError):
    """Raised when audit log validation fails."""

    def __init__(
        self,
        message: str = "Audit log validation failed.",
    ) -> None:
        """Initialize the exception."""
        super().__init__(
            message=message,
            status_code=HTTPStatus.BAD_REQUEST,
        )


class AuditPermissionDeniedError(AuditError):
    """Raised when the user is not permitted to access audit logs."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__(
            message="Permission denied.",
            status_code=HTTPStatus.FORBIDDEN,
        )


class AuditLoggingError(AuditError):
    """Raised when writing an audit log fails."""

    def __init__(
        self,
        message: str = "Failed to write audit log.",
    ) -> None:
        """Initialize the exception."""
        super().__init__(
            message=message,
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )


class AuditSearchError(AuditError):
    """Raised when an audit log search fails."""

    def __init__(
        self,
        message: str = "Audit log search failed.",
    ) -> None:
        """Initialize the exception."""
        super().__init__(
            message=message,
            status_code=HTTPStatus.BAD_REQUEST,
        )
