"""Local file storage for attachments.

Uses ``settings.UPLOAD_PATH`` -- the storage location already declared
for this purpose -- to persist attachment bytes on local disk. This is
the ``local`` storage provider named by ``DEFAULT_STORAGE_PROVIDER`` in
``app.attachments.constants``.
"""

from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
from pathlib import Path
from uuid import UUID, uuid4

from app.attachments.exceptions import AttachmentStorageError
from app.config.settings import settings


@dataclass(slots=True, frozen=True)
class StoredAttachment:
    """Result of persisting an attachment's bytes to storage."""

    filename: str
    storage_key: str
    storage_path: str
    checksum: str
    file_size: int


def _sanitize_filename(filename: str) -> str:
    """Strip any directory components from a client-supplied filename."""
    return Path(filename).name or "file"


def _attachments_root() -> Path:
    """Return the root directory for stored attachment files."""
    return Path(settings.UPLOAD_PATH) / "attachments"


def save_attachment(
    organization_id: UUID,
    original_filename: str,
    content: bytes,
) -> StoredAttachment:
    """Persist attachment bytes to local disk and return storage metadata."""
    safe_name = _sanitize_filename(original_filename)
    stored_filename = f"{uuid4().hex}_{safe_name}"
    storage_key = f"{organization_id}/{stored_filename}"

    path = _attachments_root() / storage_key

    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
    except OSError as exc:
        raise AttachmentStorageError(
            "Failed to store attachment file.",
        ) from exc

    return StoredAttachment(
        filename=stored_filename,
        storage_key=storage_key,
        storage_path=str(path),
        checksum=sha256(content).hexdigest(),
        file_size=len(content),
    )


def read_attachment(storage_path: str) -> bytes:
    """Read attachment bytes back from local disk."""
    path = Path(storage_path)

    if not path.is_file():
        raise AttachmentStorageError(
            "Stored attachment file is missing.",
        )

    try:
        return path.read_bytes()
    except OSError as exc:
        raise AttachmentStorageError(
            "Failed to read attachment file.",
        ) from exc


def delete_attachment_file(storage_path: str) -> None:
    """Best-effort removal of an attachment's stored file."""
    path = Path(storage_path)

    try:
        path.unlink(missing_ok=True)
    except OSError:
        return
