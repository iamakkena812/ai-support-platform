"""Repository for AI Vector Store operations."""

from __future__ import annotations

from collections.abc import Sequence
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.ai.embeddings.models import Embedding


class VectorStoreRepository:
    """Repository for vector search operations."""

    def __init__(self, db: Session) -> None:
        """Initialize the repository.

        Args:
            db: Database session.
        """
        self._db = db

    def search(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> Sequence[Embedding]:
        """Return embeddings available for vector search."""
        statement = select(Embedding).offset(offset).limit(limit)
        return self._db.scalars(statement).all()

    def top_k(
        self,
        *,
        k: int = 5,
    ) -> Sequence[Embedding]:
        """Return the first k embeddings.

        Placeholder implementation until native vector search is added.
        """
        statement = select(Embedding).limit(k)
        return self._db.scalars(statement).all()

    def search_by_source(
        self,
        *,
        source_type: str,
        source_id: UUID,
        offset: int = 0,
        limit: int = 100,
    ) -> Sequence[Embedding]:
        """Return embeddings for a source."""
        statement = (
            select(Embedding)
            .where(
                Embedding.source_type == source_type,
                Embedding.source_id == source_id,
            )
            .offset(offset)
            .limit(limit)
        )
        return self._db.scalars(statement).all()

    def search_by_knowledge(
        self,
        *,
        knowledge_id: UUID,
        offset: int = 0,
        limit: int = 100,
    ) -> Sequence[Embedding]:
        """Return embeddings for a knowledge record."""
        statement = (
            select(Embedding)
            .where(Embedding.knowledge_id == knowledge_id)
            .offset(offset)
            .limit(limit)
        )
        return self._db.scalars(statement).all()

    def get(
        self,
        embedding_id: UUID,
    ) -> Embedding | None:
        """Return an embedding by ID."""
        statement = select(Embedding).where(Embedding.id == embedding_id)
        return self._db.scalar(statement)

    def count(self) -> int:
        """Return the total number of embeddings."""
        statement = select(func.count()).select_from(Embedding)
        return int(self._db.scalar(statement) or 0)
