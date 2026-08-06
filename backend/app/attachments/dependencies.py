"""Dependency injection for the attachments module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.attachments.repository import AttachmentRepository
from app.attachments.service import AttachmentService
from app.database.session import get_db


def get_attachment_repository(
    session: Annotated[Session, Depends(get_db)],
) -> AttachmentRepository:
    """Return an AttachmentRepository instance."""
    return AttachmentRepository(session)


def get_attachment_service(
    repository: Annotated[
        AttachmentRepository,
        Depends(get_attachment_repository),
    ],
) -> AttachmentService:
    """Return an AttachmentService instance."""
    return AttachmentService(repository)


AttachmentRepositoryDependency = Annotated[
    AttachmentRepository,
    Depends(get_attachment_repository),
]

AttachmentServiceDependency = Annotated[
    AttachmentService,
    Depends(get_attachment_service),
]
