"""Service for the AI Knowledge module."""

from __future__ import annotations

from uuid import UUID

from app.ai.knowledge.exceptions import (
    KnowledgeAlreadyExistsError,
    KnowledgeNotFoundError,
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


class AIKnowledgeService:
    """Service for knowledge base business logic."""

    def __init__(
        self,
        repository: AIKnowledgeRepository,
    ) -> None:
        """Initialize the knowledge service.

        Args:
            repository: Knowledge repository.
        """
        self._repository = repository

    def create_knowledge(
        self,
        organization_id: UUID,
        user_id: UUID,
        request: KnowledgeCreate,
    ) -> KnowledgeResponse:
        """Create a knowledge base."""
        if self._repository.exists(
            organization_id=organization_id,
            name=request.name,
        ):
            raise KnowledgeAlreadyExistsError()

        knowledge = KnowledgeBase(
            organization_id=organization_id,
            name=request.name,
            description=request.description,
            visibility=request.visibility,
            metadata_json=request.metadata,
            created_by=user_id,
            updated_by=user_id,
        )

        knowledge = self._repository.create(knowledge)

        return KnowledgeMapper.to_response(knowledge)

    def get_knowledge(
        self,
        knowledge_id: UUID,
        organization_id: UUID,
    ) -> KnowledgeResponse:
        """Get a knowledge base."""
        knowledge = self._repository.get_by_id(
            knowledge_id=knowledge_id,
            organization_id=organization_id,
        )

        if knowledge is None:
            raise KnowledgeNotFoundError()

        return KnowledgeMapper.to_response(knowledge)

    def list_knowledge(
        self,
        organization_id: UUID,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> KnowledgeListResponse:
        """List knowledge bases."""
        items = self._repository.list(
            organization_id=organization_id,
            offset=offset,
            limit=limit,
        )

        total = self._repository.count(
            organization_id=organization_id,
        )

        return KnowledgeMapper.to_list_response(
            items,
            total=total,
            offset=offset,
            limit=limit,
        )

    def update_knowledge(
        self,
        knowledge_id: UUID,
        organization_id: UUID,
        user_id: UUID,
        request: KnowledgeUpdate,
    ) -> KnowledgeResponse:
        """Update a knowledge base."""
        knowledge = self._repository.get_by_id(
            knowledge_id=knowledge_id,
            organization_id=organization_id,
        )

        if knowledge is None:
            raise KnowledgeNotFoundError()

        update_data = request.model_dump(
            exclude_unset=True,
        )

        if "metadata" in update_data:
            update_data["metadata_json"] = update_data.pop("metadata")

        for field, value in update_data.items():
            setattr(
                knowledge,
                field,
                value,
            )

        knowledge.updated_by = user_id

        knowledge = self._repository.update(
            knowledge,
        )

        return KnowledgeMapper.to_response(knowledge)

    def delete_knowledge(
        self,
        knowledge_id: UUID,
        organization_id: UUID,
    ) -> None:
        """Delete a knowledge base."""
        knowledge = self._repository.get_by_id(
            knowledge_id=knowledge_id,
            organization_id=organization_id,
        )

        if knowledge is None:
            raise KnowledgeNotFoundError()

        self._repository.delete(
            knowledge,
        )
