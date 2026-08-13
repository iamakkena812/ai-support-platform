"""Dependencies for the AI Documents module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.ai.documents.repository import DocumentRepository
from app.ai.documents.service import DocumentService
from app.ai.knowledge.dependencies import get_ai_knowledge_repository
from app.ai.knowledge.repository import AIKnowledgeRepository
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

KnowledgeRepositoryDep = Annotated[
    AIKnowledgeRepository,
    Depends(get_ai_knowledge_repository),
]


def get_document_service(
    repository: DocumentRepositoryDep,
    knowledge_repository: KnowledgeRepositoryDep,
) -> DocumentService:
    """Create a document service.

    Args:
        repository: Document repository.
        knowledge_repository: Knowledge base repository.

    Returns:
        Document service.
    """
    return DocumentService(repository, knowledge_repository)


DocumentServiceDep = Annotated[
    DocumentService,
    Depends(get_document_service),
]
