"""Dependency injection providers for the AI Embeddings module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.ai.embeddings.repository import AIEmbeddingRepository
from app.ai.embeddings.service import AIEmbeddingService
from app.database.dependencies import get_db


def get_embedding_repository(
    session: Annotated[
        Session,
        Depends(get_db),
    ],
) -> AIEmbeddingRepository:
    """Return an embedding repository instance."""
    return AIEmbeddingRepository(session)


EmbeddingRepositoryDep = Annotated[
    AIEmbeddingRepository,
    Depends(get_embedding_repository),
]


def get_embedding_service(
    repository: EmbeddingRepositoryDep,
) -> AIEmbeddingService:
    """Return an embedding service instance."""
    return AIEmbeddingService(repository)


EmbeddingServiceDep = Annotated[
    AIEmbeddingService,
    Depends(get_embedding_service),
]
