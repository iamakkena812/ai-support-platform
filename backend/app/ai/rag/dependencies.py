"""Dependencies for the AI RAG module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.ai.rag.repository import RAGRepository
from app.ai.rag.service import RAGService
from app.database.dependencies import get_db

DatabaseSessionDep = Annotated[
    Session,
    Depends(get_db),
]


def get_rag_repository(
    db: DatabaseSessionDep,
) -> RAGRepository:
    """Create an AI RAG repository.

    Args:
        db: Database session.

    Returns:
        RAGRepository: Repository instance.
    """
    return RAGRepository(db)


RAGRepositoryDep = Annotated[
    RAGRepository,
    Depends(get_rag_repository),
]


def get_rag_service(
    repository: RAGRepositoryDep,
) -> RAGService:
    """Create an AI RAG service.

    Args:
        repository: RAG repository.

    Returns:
        RAGService: Service instance.
    """
    return RAGService(repository)


RAGServiceDep = Annotated[
    RAGService,
    Depends(get_rag_service),
]
