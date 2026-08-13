"""Service for the AI Knowledge module."""

from __future__ import annotations

from uuid import UUID

from app.ai.knowledge.constants import KnowledgeVisibility
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
from app.core.exceptions import AuthorizationException


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
        user_id: UUID,
    ) -> KnowledgeResponse:
        """Get a knowledge base.

        Raises:
            KnowledgeNotFoundError: If the knowledge base does not exist
                in the caller's organization.
            AuthorizationException: If the knowledge base is private and
                the caller is not its creator.
        """
        knowledge = self._repository.get_by_id(
            knowledge_id=knowledge_id,
            organization_id=organization_id,
        )

        if knowledge is None:
            raise KnowledgeNotFoundError()

        self._ensure_visible(knowledge, user_id)

        return KnowledgeMapper.to_response(knowledge)

    def list_knowledge(
        self,
        organization_id: UUID,
        user_id: UUID,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> KnowledgeListResponse:
        """List knowledge bases visible to the caller."""
        items = self._repository.list(
            organization_id=organization_id,
            user_id=user_id,
            offset=offset,
            limit=limit,
        )

        total = self._repository.count(
            organization_id=organization_id,
            user_id=user_id,
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
        """Update a knowledge base.

        Raises:
            KnowledgeNotFoundError: If the knowledge base does not exist
                in the caller's organization.
            AuthorizationException: If the caller is not its creator.
        """
        knowledge = self._repository.get_by_id(
            knowledge_id=knowledge_id,
            organization_id=organization_id,
        )

        if knowledge is None:
            raise KnowledgeNotFoundError()

        self._ensure_owner(knowledge, user_id)

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
        user_id: UUID,
    ) -> None:
        """Delete a knowledge base.

        Raises:
            KnowledgeNotFoundError: If the knowledge base does not exist
                in the caller's organization.
            AuthorizationException: If the caller is not its creator.
        """
        knowledge = self._repository.get_by_id(
            knowledge_id=knowledge_id,
            organization_id=organization_id,
        )

        if knowledge is None:
            raise KnowledgeNotFoundError()

        self._ensure_owner(knowledge, user_id)

        self._repository.delete(
            knowledge,
        )

    @staticmethod
    def _ensure_visible(
        knowledge: KnowledgeBase,
        user_id: UUID,
    ) -> None:
        """Ensure a private knowledge base is only visible to its creator."""
        if (
            knowledge.visibility == KnowledgeVisibility.PRIVATE
            and knowledge.created_by != user_id
        ):
            raise AuthorizationException(
                "You do not have access to this knowledge base.",
            )

    @staticmethod
    def _ensure_owner(
        knowledge: KnowledgeBase,
        user_id: UUID,
    ) -> None:
        """Ensure only the creator may modify a knowledge base."""
        if knowledge.created_by != user_id:
            raise AuthorizationException(
                "Only the creator may modify this knowledge base.",
            )
