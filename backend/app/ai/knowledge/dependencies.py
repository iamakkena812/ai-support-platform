"""Dependencies for the Knowledge module."""

from __future__ import annotations

from fastapi import Depends
from sqlalchemy.orm import Session

from app.ai.knowledge.repository import AIKnowledgeRepository
from app.ai.knowledge.service import AIKnowledgeService
from app.database.session import get_db


def get_ai_knowledge_repository(
    session: Session = Depends(get_db),
) -> AIKnowledgeRepository:
    """Create a KnowledgeRepository dependency.

    Args:
        session: Database session.

    Returns:
        Knowledge repository.
    """
    return AIKnowledgeRepository(session)


def get_ai_knowledge_service(
    repository: AIKnowledgeRepository = Depends(
        get_ai_knowledge_repository,
    ),
) -> AIKnowledgeService:
    """Create a KnowledgeService dependency.

    Args:
        repository: Knowledge repository.

    Returns:
        Knowledge service.
    """
    return AIKnowledgeService(repository)
