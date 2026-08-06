"""Exceptions for the AI Ingestion module."""

from __future__ import annotations


class IngestionError(Exception):
    """Base ingestion exception."""


class IngestionNotFoundError(IngestionError):
    """Raised when an ingestion job cannot be found."""


class InvalidIngestionStatusError(IngestionError):
    """Raised when an invalid ingestion status is supplied."""


class UnsupportedDocumentTypeError(IngestionError):
    """Raised when an unsupported document type is uploaded."""


class IngestionProcessingError(IngestionError):
    """Raised when ingestion processing fails."""
