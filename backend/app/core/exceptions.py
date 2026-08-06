"""Application exception hierarchy."""

from __future__ import annotations

from http import HTTPStatus


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        status_code: HTTPStatus = HTTPStatus.INTERNAL_SERVER_ERROR,
    ) -> None:
        """Initialize the application exception.

        Args:
            message: Human-readable error message.
            status_code: HTTP status code associated with the exception.
        """
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class ValidationException(AppException):
    """Raised when validation fails."""

    def __init__(
        self,
        message: str = "Validation failed.",
    ) -> None:
        """Initialize the validation exception.

        Args:
            message: Validation error message.
        """
        super().__init__(
            message=message,
            status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
        )


class AuthenticationException(AppException):
    """Raised when authentication fails."""

    def __init__(
        self,
        message: str = "Authentication failed.",
    ) -> None:
        """Initialize the authentication exception.

        Args:
            message: Authentication error message.
        """
        super().__init__(
            message=message,
            status_code=HTTPStatus.UNAUTHORIZED,
        )


class AuthorizationException(AppException):
    """Raised when authorization fails."""

    def __init__(
        self,
        message: str = "Access denied.",
    ) -> None:
        """Initialize the authorization exception.

        Args:
            message: Authorization error message.
        """
        super().__init__(
            message=message,
            status_code=HTTPStatus.FORBIDDEN,
        )


class ResourceNotFoundException(AppException):
    """Raised when a resource cannot be found."""

    def __init__(
        self,
        resource: str,
    ) -> None:
        """Initialize the resource not found exception.

        Args:
            resource: Name of the missing resource.
        """
        super().__init__(
            message=f"{resource} not found.",
            status_code=HTTPStatus.NOT_FOUND,
        )


class ConflictException(AppException):
    """Raised when a resource conflict occurs."""

    def __init__(
        self,
        message: str,
    ) -> None:
        """Initialize the conflict exception.

        Args:
            message: Conflict error message.
        """
        super().__init__(
            message=message,
            status_code=HTTPStatus.CONFLICT,
        )


class DatabaseException(AppException):
    """Raised for database-related errors."""

    def __init__(
        self,
        message: str = "Database operation failed.",
    ) -> None:
        """Initialize the database exception.

        Args:
            message: Database error message.
        """
        super().__init__(
            message=message,
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )


class AIServiceException(AppException):
    """Raised when an AI service fails."""

    def __init__(
        self,
        message: str = "AI service unavailable.",
    ) -> None:
        """Initialize the AI service exception.

        Args:
            message: AI service error message.
        """
        super().__init__(
            message=message,
            status_code=HTTPStatus.SERVICE_UNAVAILABLE,
        )
