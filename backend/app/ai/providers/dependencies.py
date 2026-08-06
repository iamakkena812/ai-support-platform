"""Dependency providers for AI."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.ai.providers.repository import AIRepository
from app.ai.providers.service import AIService
from app.database.session import get_db


def get_ai_repository(
    db: Annotated[Session, Depends(get_db)],
) -> AIRepository:
    """Return an AI repository instance."""
    return AIRepository(db)


def get_ai_service(
    repository: Annotated[
        AIRepository,
        Depends(get_ai_repository),
    ],
) -> AIService:
    """Return an AI service instance."""
    return AIService(repository)
