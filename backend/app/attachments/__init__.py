"""Attachment management package."""

from __future__ import annotations

from app.attachments.exceptions import (
    AttachmentError,
    AttachmentNotFoundError,
)
from app.attachments.models import Attachment
from app.attachments.repository import AttachmentRepository
from app.attachments.router import router
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
    "AttachmentCreate",
    "AttachmentDeleteResponse",
    "AttachmentError",
    "AttachmentList",
    "AttachmentNotFoundError",
    "AttachmentRead",
    "AttachmentRepository",
    "AttachmentService",
    "AttachmentUpdate",
    "AttachmentUploadResponse",
    "router",
]
