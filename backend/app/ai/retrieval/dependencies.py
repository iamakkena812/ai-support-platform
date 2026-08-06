"""Dependencies for the AI Retrieval module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.ai.retrieval.repository import RetrievalRepository
from app.ai.retrieval.service import RetrievalService
from app.database.dependencies import get_db

DatabaseSessionDep = Annotated[
    Session,
    Depends(get_db),
]


def get_retrieval_repository(
    db: DatabaseSessionDep,
) -> RetrievalRepository:
    """Create a retrieval repository.

    Args:
        db: Database session.

    Returns:
        Retrieval repository.
    """
    return RetrievalRepository(db)


RetrievalRepositoryDep = Annotated[
    RetrievalRepository,
    Depends(get_retrieval_repository),
]


def get_retrieval_service(
    repository: RetrievalRepositoryDep,
) -> RetrievalService:
    """Create a retrieval service.

    Args:
        repository: Retrieval repository.

    Returns:
        Retrieval service.
    """
    return RetrievalService(repository)


RetrievalServiceDep = Annotated[
    RetrievalService,
    Depends(get_retrieval_service),
]
