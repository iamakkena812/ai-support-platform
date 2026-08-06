"""Router for the AI Knowledge module."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.ai.knowledge.dependencies import get_ai_knowledge_service
from app.ai.knowledge.schemas import (
    KnowledgeCreate,
    KnowledgeListResponse,
    KnowledgeResponse,
    KnowledgeUpdate,
)
from app.ai.knowledge.service import AIKnowledgeService
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/knowledge",
    tags=["AI - Knowledge"],
)


@router.post(
    "",
    response_model=KnowledgeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a knowledge base",
)
def create_knowledge(
    request: KnowledgeCreate,
    service: AIKnowledgeService = Depends(get_ai_knowledge_service),
    current_user: User = Depends(get_current_user),
) -> KnowledgeResponse:
    """Create a knowledge base."""
    return service.create_knowledge(
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        request=request,
    )


@router.get(
    "",
    response_model=KnowledgeListResponse,
    summary="List knowledge bases",
)
def list_knowledge(
    offset: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    service: AIKnowledgeService = Depends(get_ai_knowledge_service),
    current_user: User = Depends(get_current_user),
) -> KnowledgeListResponse:
    """List knowledge bases."""
    return service.list_knowledge(
        organization_id=current_user.organization_id,
        offset=offset,
        limit=limit,
    )


@router.get(
    "/{knowledge_id}",
    response_model=KnowledgeResponse,
    summary="Get a knowledge base",
)
def get_knowledge(
    knowledge_id: UUID,
    service: AIKnowledgeService = Depends(get_ai_knowledge_service),
    current_user: User = Depends(get_current_user),
) -> KnowledgeResponse:
    """Get a knowledge base."""
    return service.get_knowledge(
        knowledge_id=knowledge_id,
        organization_id=current_user.organization_id,
    )


@router.patch(
    "/{knowledge_id}",
    response_model=KnowledgeResponse,
    summary="Update a knowledge base",
)
def update_knowledge(
    knowledge_id: UUID,
    request: KnowledgeUpdate,
    service: AIKnowledgeService = Depends(get_ai_knowledge_service),
    current_user: User = Depends(get_current_user),
) -> KnowledgeResponse:
    """Update a knowledge base."""
    return service.update_knowledge(
        knowledge_id=knowledge_id,
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        request=request,
    )


@router.delete(
    "/{knowledge_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a knowledge base",
)
def delete_knowledge(
    knowledge_id: UUID,
    service: AIKnowledgeService = Depends(get_ai_knowledge_service),
    current_user: User = Depends(get_current_user),
) -> Response:
    """Delete a knowledge base."""
    service.delete_knowledge(
        knowledge_id=knowledge_id,
        organization_id=current_user.organization_id,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
