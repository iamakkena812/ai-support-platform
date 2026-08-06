"""Exceptions for the AI Documents module."""

from __future__ import annotations


class DocumentError(Exception):
    """Base exception for document errors."""


class DocumentNotFoundError(DocumentError):
    """Raised when a document cannot be found."""


class DuplicateDocumentError(DocumentError):
    """Raised when a duplicate document exists."""


class InvalidDocumentError(DocumentError):
    """Raised when document data is invalid."""


class InvalidDocumentStatusError(DocumentError):
    """Raised when a document status transition is invalid."""
