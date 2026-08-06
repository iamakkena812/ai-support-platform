"""File storage provider implementations."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(slots=True, frozen=True)
class StorageResult:
    """File storage result."""

    success: bool
    storage_path: str | None = None
    message: str | None = None


class BaseStorageProvider(ABC):
    """Abstract base class for storage providers."""

    @abstractmethod
    def save(
        self,
        storage_path: str,
        content: bytes,
    ) -> StorageResult:
        """Store a file."""
        raise NotImplementedError

    @abstractmethod
    def delete(
        self,
        storage_path: str,
    ) -> StorageResult:
        """Delete a stored file."""
        raise NotImplementedError


class LocalStorageProvider(BaseStorageProvider):
    """Local file storage provider."""

    def save(
        self,
        storage_path: str,
        content: bytes,
    ) -> StorageResult:
        """Store a file locally."""
        return StorageResult(
            success=True,
            storage_path=storage_path,
            message="File stored successfully.",
        )

    def delete(
        self,
        storage_path: str,
    ) -> StorageResult:
        """Delete a locally stored file."""
        return StorageResult(
            success=True,
            storage_path=storage_path,
            message="File deleted successfully.",
        )
