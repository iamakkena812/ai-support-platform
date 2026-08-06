"""Exceptions for the AI Embeddings module."""

from __future__ import annotations

from http import HTTPStatus

from app.core.exceptions import (
    AppException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
)


class EmbeddingError(AppException):
    """Base exception for the AI Embeddings module."""

    def __init__(
        self,
        message: str = "Embedding module error.",
        status_code: HTTPStatus = HTTPStatus.INTERNAL_SERVER_ERROR,
    ) -> None:
        """Initialize the embedding exception.

        Args:
            message: Error message.
            status_code: HTTP status code.
        """
        super().__init__(
            message=message,
            status_code=status_code,
        )


class EmbeddingNotFoundError(ResourceNotFoundException):
    """Raised when an embedding cannot be found."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__("Embedding")


class EmbeddingAlreadyExistsError(ConflictException):
    """Raised when an embedding already exists."""

    def __init__(self) -> None:
        """Initialize the exception."""
        super().__init__("Embedding already exists.")


class EmbeddingValidationError(ValidationException):
    """Raised when embedding validation fails."""

    def __init__(
        self,
        message: str = "Embedding validation failed.",
    ) -> None:
        """Initialize the exception.

        Args:
            message: Validation error message.
        """
        super().__init__(message)
