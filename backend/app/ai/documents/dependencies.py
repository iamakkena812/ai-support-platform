"""Dependencies for the AI Documents module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.ai.documents.repository import DocumentRepository
from app.ai.documents.service import DocumentService
from app.database.dependencies import get_db

DatabaseSessionDep = Annotated[
    Session,
    Depends(get_db),
]


def get_document_repository(
    db: DatabaseSessionDep,
) -> DocumentRepository:
    """Create a document repository.

    Args:
        db: Database session.

    Returns:
        Document repository.
    """
    return DocumentRepository(db)


DocumentRepositoryDep = Annotated[
    DocumentRepository,
    Depends(get_document_repository),
]


def get_document_service(
    repository: DocumentRepositoryDep,
) -> DocumentService:
    """Create a document service.

    Args:
        repository: Document repository.

    Returns:
        Document service.
    """
    return DocumentService(repository)


DocumentServiceDep = Annotated[
    DocumentService,
    Depends(get_document_service),
]
