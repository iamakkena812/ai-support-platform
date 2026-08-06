"""File management constants."""

from __future__ import annotations

from enum import StrEnum

FILENAME_MIN_LENGTH = 1
FILENAME_MAX_LENGTH = 255

CONTENT_TYPE_MAX_LENGTH = 255

STORAGE_PATH_MAX_LENGTH = 1024

CHECKSUM_LENGTH = 64

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


class FileStatus(StrEnum):
    """Supported file statuses."""

    PENDING = "pending"
    UPLOADING = "uploading"
    ACTIVE = "active"
    FAILED = "failed"
    DELETED = "deleted"


class FileProvider(StrEnum):
    """Supported storage providers."""

    LOCAL = "local"
    AMAZON_S3 = "amazon_s3"
    AZURE_BLOB = "azure_blob"
    GOOGLE_CLOUD = "google_cloud"


class FileCategory(StrEnum):
    """Supported file categories."""

    ATTACHMENT = "attachment"
    DOCUMENT = "document"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    ARCHIVE = "archive"
    OTHER = "other"
