"""Repository for the AI Knowledge module."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.ai.knowledge.models import KnowledgeBase


class AIKnowledgeRepository:
    """Repository for knowledge base persistence."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize the repository.

        Args:
            session: Database session.
        """
        self._session = session

    def create(
        self,
        knowledge: KnowledgeBase,
    ) -> KnowledgeBase:
        """Create a knowledge base."""
        self._session.add(knowledge)
        self._session.commit()
        self._session.refresh(knowledge)
        return knowledge

    def get_by_id(
        self,
        knowledge_id: UUID,
        organization_id: UUID,
    ) -> KnowledgeBase | None:
        """Return a knowledge base by ID."""
        statement = select(KnowledgeBase).where(
            KnowledgeBase.id == knowledge_id,
            KnowledgeBase.organization_id == organization_id,
        )

        return self._session.scalar(statement)

    def get_by_name(
        self,
        organization_id: UUID,
        name: str,
    ) -> KnowledgeBase | None:
        """Return a knowledge base by name."""
        statement = select(KnowledgeBase).where(
            KnowledgeBase.organization_id == organization_id,
            KnowledgeBase.name == name,
        )

        return self._session.scalar(statement)

    def list(
        self,
        organization_id: UUID,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> list[KnowledgeBase]:
        """Return knowledge bases for an organization."""
        statement = (
            select(KnowledgeBase)
            .where(
                KnowledgeBase.organization_id == organization_id,
            )
            .order_by(KnowledgeBase.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        return list(self._session.scalars(statement))

    def count(
        self,
        organization_id: UUID,
    ) -> int:
        """Return the number of knowledge bases."""
        statement = (
            select(func.count())
            .select_from(KnowledgeBase)
            .where(
                KnowledgeBase.organization_id == organization_id,
            )
        )

        return int(self._session.scalar(statement) or 0)

    def exists(
        self,
        organization_id: UUID,
        name: str,
    ) -> bool:
        """Return whether a knowledge base exists."""
        return (
            self.get_by_name(
                organization_id=organization_id,
                name=name,
            )
            is not None
        )

    def update(
        self,
        knowledge: KnowledgeBase,
    ) -> KnowledgeBase:
        """Update a knowledge base."""
        self._session.commit()
        self._session.refresh(knowledge)
        return knowledge

    def delete(
        self,
        knowledge: KnowledgeBase,
    ) -> None:
        """Delete a knowledge base."""
        self._session.delete(knowledge)
        self._session.commit()
