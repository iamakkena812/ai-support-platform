"""Constants for the AI Documents module."""

from __future__ import annotations

DEFAULT_DOCUMENT_VERSION = 1

DEFAULT_STATUS = "registered"

DEFAULT_PAGE = 1

DEFAULT_PAGE_SIZE = 20

MAX_PAGE_SIZE = 100

MAX_FILENAME_LENGTH = 255

MAX_CONTENT_TYPE_LENGTH = 100

SUPPORTED_DOCUMENT_TYPES = (
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
)

DOCUMENT_STATUSES = (
    "registered",
    "parsing",
    "parsed",
    "chunking",
    "chunked",
    "embedding",
    "embedded",
    "indexed",
    "failed",
    "deleted",
)
