"""Dependencies for the AI Ingestion module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.ai.ingestion.repository import IngestionRepository
from app.ai.ingestion.service import IngestionService
from app.database.dependencies import get_db

DatabaseSessionDep = Annotated[Session, Depends(get_db)]


def get_ingestion_repository(
    session: DatabaseSessionDep,
) -> IngestionRepository:
    """Return ingestion repository."""
    return IngestionRepository(session)


IngestionRepositoryDep = Annotated[
    IngestionRepository,
    Depends(get_ingestion_repository),
]


def get_ingestion_service(
    repository: IngestionRepositoryDep,
) -> IngestionService:
    """Return ingestion service."""
    return IngestionService(repository)


IngestionServiceDep = Annotated[
    IngestionService,
    Depends(get_ingestion_service),
]
