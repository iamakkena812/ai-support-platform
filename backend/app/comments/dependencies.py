"""Comment dependency providers."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.comments.repository import CommentRepository
from app.comments.service import CommentService
from app.database import get_db
from app.tickets.repository import TicketRepository

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


def get_comment_repository(
    db: DatabaseSession,
) -> CommentRepository:
    """Return a comment repository."""
    return CommentRepository(db)


CommentRepositoryDependency = Annotated[
    CommentRepository,
    Depends(get_comment_repository),
]


def get_comment_ticket_repository(
    db: DatabaseSession,
) -> TicketRepository:
    """Return a ticket repository for comment-ticket validation."""
    return TicketRepository(db)


CommentTicketRepositoryDependency = Annotated[
    TicketRepository,
    Depends(get_comment_ticket_repository),
]


def get_comment_service(
    repository: CommentRepositoryDependency,
    ticket_repository: CommentTicketRepositoryDependency,
) -> CommentService:
    """Return a comment service."""
    return CommentService(repository, ticket_repository)


CommentServiceDependency = Annotated[
    CommentService,
    Depends(get_comment_service),
]
