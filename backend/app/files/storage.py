"""File storage utilities."""

from __future__ import annotations

from hashlib import sha256


def build_storage_path(
    filename: str,
) -> str:
    """Build a storage path for a file."""
    return f"uploads/{filename}"


def calculate_checksum(
    content: bytes,
) -> str:
    """Calculate the SHA-256 checksum of file content."""
    return sha256(content).hexdigest()
