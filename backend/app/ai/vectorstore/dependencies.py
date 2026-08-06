"""Dependencies for the AI Vector Store module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.ai.vectorstore.repository import VectorStoreRepository
from app.ai.vectorstore.service import VectorStoreService
from app.database.dependencies import get_db

DatabaseSessionDep = Annotated[
    Session,
    Depends(get_db),
]


def get_vectorstore_repository(
    db: DatabaseSessionDep,
) -> VectorStoreRepository:
    """Create a Vector Store repository."""
    return VectorStoreRepository(db)


VectorStoreRepositoryDep = Annotated[
    VectorStoreRepository,
    Depends(get_vectorstore_repository),
]


def get_vectorstore_service(
    repository: VectorStoreRepositoryDep,
) -> VectorStoreService:
    """Create a Vector Store service."""
    return VectorStoreService(repository)


VectorStoreServiceDep = Annotated[
    VectorStoreService,
    Depends(get_vectorstore_service),
]
