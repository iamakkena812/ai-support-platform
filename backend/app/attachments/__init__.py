"""Attachments package."""

from __future__ import annotations

from app.attachments.models import Attachment
from app.attachments.repository import AttachmentRepository
from app.attachments.schemas import (
    AttachmentCreate,
    AttachmentDeleteResponse,
    AttachmentList,
    AttachmentRead,
    AttachmentUpdate,
    AttachmentUploadResponse,
)
from app.attachments.service import AttachmentService

__all__ = [
    "Attachment",
    "AttachmentRepository",
    "AttachmentService",
    "AttachmentCreate",
    "AttachmentUpdate",
    "AttachmentRead",
    "AttachmentList",
    "AttachmentUploadResponse",
    "AttachmentDeleteResponse",
]
