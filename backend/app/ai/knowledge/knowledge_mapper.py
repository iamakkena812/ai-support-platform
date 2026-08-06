"""Mapper for the Knowledge module."""

from __future__ import annotations

from app.ai.knowledge.models import KnowledgeBase
from app.ai.knowledge.schemas import (
    KnowledgeListResponse,
    KnowledgeResponse,
)


class KnowledgeMapper:
    """Mapper for converting knowledge models to response schemas."""

    @staticmethod
    def to_response(
        knowledge: KnowledgeBase,
    ) -> KnowledgeResponse:
        """Convert a KnowledgeBase model to a KnowledgeResponse.

        Args:
            knowledge: Knowledge database model.

        Returns:
            Knowledge response schema.
        """
        return KnowledgeResponse(
            id=knowledge.id,
            organization_id=knowledge.organization_id,
            name=knowledge.name,
            description=knowledge.description,
            status=knowledge.status,
            visibility=knowledge.visibility,
            metadata=knowledge.metadata_json,
            created_by=knowledge.created_by,
            updated_by=knowledge.updated_by,
            created_at=knowledge.created_at,
            updated_at=knowledge.updated_at,
        )

    @staticmethod
    def to_list_response(
        items: list[KnowledgeBase],
        *,
        total: int,
        offset: int,
        limit: int,
    ) -> KnowledgeListResponse:
        """Convert knowledge models to a paginated response.

        Args:
            items: List of knowledge models.
            total: Total number of knowledge bases.
            offset: Pagination offset.
            limit: Pagination limit.

        Returns:
            Paginated knowledge response.
        """
        return KnowledgeListResponse(
            items=[KnowledgeMapper.to_response(item) for item in items],
            total=total,
            offset=offset,
            limit=limit,
        )
