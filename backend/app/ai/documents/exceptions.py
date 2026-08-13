"""Exceptions for the AI Documents module."""

from __future__ import annotations

from http import HTTPStatus

from app.core.exceptions import AppException


class DocumentError(AppException):
    """Base exception for document errors."""

    def __init__(
        self,
        message: str = "Document error.",
        status_code: HTTPStatus = HTTPStatus.INTERNAL_SERVER_ERROR,
    ) -> None:
        """Initialize the exception."""
        super().__init__(message=message, status_code=status_code)


class DocumentNotFoundError(DocumentError):
    """Raised when a document cannot be found."""

    def __init__(self, document_id: str) -> None:
        """Initialize the exception.

        Args:
            document_id: Document identifier.
        """
        super().__init__(
            f"Document '{document_id}' was not found.",
            HTTPStatus.NOT_FOUND,
        )


class KnowledgeBaseNotFoundError(DocumentError):
    """Raised when a document's knowledge base does not exist.

    Applies when the referenced knowledge base does not exist in the
    caller's organization.
    """

    def __init__(self, knowledge_id: str) -> None:
        """Initialize the exception.

        Args:
            knowledge_id: Knowledge base identifier.
        """
        super().__init__(
            f"Knowledge base '{knowledge_id}' was not found.",
            HTTPStatus.BAD_REQUEST,
        )
