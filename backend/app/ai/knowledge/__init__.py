"""Knowledge module."""

from __future__ import annotations

from app.ai.knowledge import router
from app.ai.knowledge.constants import (
    KnowledgeStatus,
    KnowledgeVisibility,
)
from app.ai.knowledge.dependencies import (
    get_ai_knowledge_repository,
    get_ai_knowledge_service,
)
from app.ai.knowledge.exceptions import (
    KnowledgeAlreadyExistsError,
    KnowledgeError,
    KnowledgeNotFoundError,
    KnowledgeValidationError,
)
from app.ai.knowledge.knowledge_mapper import KnowledgeMapper
from app.ai.knowledge.models import KnowledgeBase
from app.ai.knowledge.repository import AIKnowledgeRepository
from app.ai.knowledge.schemas import (
    KnowledgeCreate,
    KnowledgeListResponse,
    KnowledgeResponse,
    KnowledgeUpdate,
)
from app.ai.knowledge.service import AIKnowledgeService

__all__ = [
    "KnowledgeAlreadyExistsError",
    "KnowledgeBase",
    "KnowledgeCreate",
    "KnowledgeError",
    "KnowledgeListResponse",
    "KnowledgeMapper",
    "KnowledgeNotFoundError",
    "AIKnowledgeRepository",
    "KnowledgeResponse",
    "AIKnowledgeService",
    "KnowledgeStatus",
    "KnowledgeUpdate",
    "KnowledgeValidationError",
    "KnowledgeVisibility",
    "get_ai_knowledge_repository",
    "get_ai_knowledge_service",
    "router",
]
