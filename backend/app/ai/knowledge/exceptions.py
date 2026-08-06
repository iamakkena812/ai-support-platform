"""Exceptions for the Knowledge module."""

from __future__ import annotations

from http import HTTPStatus

from app.core.exceptions import (
    AppException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
)


class KnowledgeError(AppException):
    """Base exception for the Knowledge module."""

    def __init__(
        self,
        message: str = "Knowledge module error.",
        status_code: HTTPStatus = HTTPStatus.INTERNAL_SERVER_ERROR,
    ) -> None:
        """Initialize the knowledge exception."""
        super().__init__(
            message=message,
            status_code=status_code,
        )


class KnowledgeNotFoundError(ResourceNotFoundException):
    """Raised when a knowledge base cannot be found."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__("Knowledge base")


class KnowledgeAlreadyExistsError(ConflictException):
    """Raised when a knowledge base already exists."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__("Knowledge base already exists.")


class KnowledgeValidationError(ValidationException):
    """Raised when knowledge validation fails."""

    def __init__(
        self,
        message: str = "Knowledge validation failed.",
    ) -> None:
        """Initialize the exception."""
        super().__init__(message)
