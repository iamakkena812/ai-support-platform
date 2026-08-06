"""Constants for the attachments module."""

from __future__ import annotations

from typing import Final

MODULE_NAME: Final[str] = "attachments"

# Storage Providers
LOCAL_STORAGE: Final[str] = "local"
S3_STORAGE: Final[str] = "s3"
AZURE_BLOB_STORAGE: Final[str] = "azure_blob"
GCS_STORAGE: Final[str] = "gcs"
MINIO_STORAGE: Final[str] = "minio"

DEFAULT_STORAGE_PROVIDER: Final[str] = LOCAL_STORAGE

# File Constraints
MAX_FILE_SIZE: Final[int] = 25 * 1024 * 1024  # 25 MB
MIN_FILE_SIZE: Final[int] = 1  # 1 byte

# Filename Constraints
MAX_FILENAME_LENGTH: Final[int] = 255

# Image MIME Types
IMAGE_MIME_TYPES: Final[set[str]] = {
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
}

# Document MIME Types
DOCUMENT_MIME_TYPES: Final[set[str]] = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
}

# Archive MIME Types
ARCHIVE_MIME_TYPES: Final[set[str]] = {
    "application/zip",
    "application/x-zip-compressed",
    "application/x-7z-compressed",
    "application/x-rar-compressed",
    "application/gzip",
}

# Supported MIME Types
SUPPORTED_MIME_TYPES: Final[set[str]] = (
    IMAGE_MIME_TYPES | DOCUMENT_MIME_TYPES | ARCHIVE_MIME_TYPES
)

# Attachment Status
STATUS_ACTIVE: Final[str] = "active"
STATUS_DELETED: Final[str] = "deleted"

# Checksum Algorithms
CHECKSUM_SHA256: Final[str] = "sha256"
CHECKSUM_MD5: Final[str] = "md5"
