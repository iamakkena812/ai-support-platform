"""Dependency injection for the attachments module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.attachments.repository import AttachmentRepository
from app.attachments.service import AttachmentService
from app.comments.repository import CommentRepository
from app.database.session import get_db
from app.tickets.repository import TicketRepository

DatabaseSession = Annotated[Session, Depends(get_db)]


def get_attachment_repository(
    session: DatabaseSession,
) -> AttachmentRepository:
    """Return an AttachmentRepository instance."""
    return AttachmentRepository(session)


def get_attachment_ticket_repository(
    session: DatabaseSession,
) -> TicketRepository:
    """Return a TicketRepository for attachment-ticket validation."""
    return TicketRepository(session)


def get_attachment_comment_repository(
    session: DatabaseSession,
) -> CommentRepository:
    """Return a CommentRepository for attachment-comment validation."""
    return CommentRepository(session)


def get_attachment_service(
    repository: Annotated[
        AttachmentRepository,
        Depends(get_attachment_repository),
    ],
    ticket_repository: Annotated[
        TicketRepository,
        Depends(get_attachment_ticket_repository),
    ],
    comment_repository: Annotated[
        CommentRepository,
        Depends(get_attachment_comment_repository),
    ],
) -> AttachmentService:
    """Return an AttachmentService instance."""
    return AttachmentService(
        repository,
        ticket_repository,
        comment_repository,
    )


AttachmentRepositoryDependency = Annotated[
    AttachmentRepository,
    Depends(get_attachment_repository),
]

AttachmentServiceDependency = Annotated[
    AttachmentService,
    Depends(get_attachment_service),
]
