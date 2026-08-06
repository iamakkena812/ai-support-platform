"""Comment dependency providers."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.comments.repository import CommentRepository
from app.comments.service import CommentService
from app.database import get_db

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


def get_comment_service(
    repository: CommentRepositoryDependency,
) -> CommentService:
    """Return a comment service."""
    return CommentService(repository)


CommentServiceDependency = Annotated[
    CommentService,
    Depends(get_comment_service),
]
