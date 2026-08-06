"""Constants for the AI Ingestion module."""

from __future__ import annotations

DEFAULT_BATCH_SIZE = 100
DEFAULT_CHUNK_SIZE = 1000
DEFAULT_CHUNK_OVERLAP = 200
DEFAULT_MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
DEFAULT_WORKERS = 4

DEFAULT_STATUS = "registered"

DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

SUPPORTED_CONTENT_TYPES: tuple[str, ...] = (
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    "text/csv",
)

INGESTION_STATUSES: tuple[str, ...] = (
    "registered",
    "queued",
    "processing",
    "parsed",
    "chunked",
    "embedded",
    "indexed",
    "completed",
    "failed",
)
