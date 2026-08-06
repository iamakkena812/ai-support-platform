"""File management database models."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.files.constants import (
    FileCategory,
    FileProvider,
    FileStatus,
)


class File(Base):
    """File metadata."""

    __tablename__ = "files"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    organization_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    uploaded_by_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=False,
        index=True,
    )

    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    content_type: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    size: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    checksum: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        index=True,
    )

    storage_path: Mapped[str] = mapped_column(
        String(1024),
        nullable=False,
    )

    provider: Mapped[FileProvider] = mapped_column(
        Enum(FileProvider),
        default=FileProvider.LOCAL,
        nullable=False,
    )

    category: Mapped[FileCategory] = mapped_column(
        Enum(FileCategory),
        default=FileCategory.ATTACHMENT,
        nullable=False,
    )

    status: Mapped[FileStatus] = mapped_column(
        Enum(FileStatus),
        default=FileStatus.PENDING,
        nullable=False,
        index=True,
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def mark_uploading(self) -> None:
        """Mark the file as uploading."""
        self.status = FileStatus.UPLOADING

    def mark_active(self) -> None:
        """Mark the file as active."""
        self.status = FileStatus.ACTIVE

    def mark_failed(self) -> None:
        """Mark the file as failed."""
        self.status = FileStatus.FAILED

    def soft_delete(self) -> None:
        """Soft delete the file."""
        self.is_deleted = True
        self.status = FileStatus.DELETED
