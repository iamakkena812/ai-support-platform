"""Repository for the AI Embeddings module."""

from __future__ import annotations

import builtins
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.ai.embeddings.models import Embedding


class AIEmbeddingRepository:
    """Repository for AI Embedding persistence."""

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
        embedding: Embedding,
    ) -> Embedding:
        """Create an embedding.

        Args:
            embedding: Embedding to create.

        Returns:
            The persisted embedding.
        """
        self._session.add(embedding)
        self._session.commit()
        self._session.refresh(embedding)
        return embedding

    def get_by_id(
        self,
        embedding_id: UUID,
        organization_id: UUID,
    ) -> Embedding | None:
        """Retrieve an embedding by identifier.

        Args:
            embedding_id: Embedding identifier.
            organization_id: Organization identifier.

        Returns:
            The embedding if found; otherwise, ``None``.
        """
        statement = select(Embedding).where(
            Embedding.id == embedding_id,
            Embedding.organization_id == organization_id,
        )

        return self._session.scalar(statement)

    def list_embeddings(
        self,
        organization_id: UUID,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> builtins.list[Embedding]:
        """List embeddings for an organization.

        Args:
            organization_id: Organization identifier.
            offset: Pagination offset.
            limit: Maximum number of records.

        Returns:
            A list of embeddings.
        """
        statement = (
            select(Embedding)
            .where(
                Embedding.organization_id == organization_id,
            )
            .order_by(
                Embedding.created_at.desc(),
            )
            .offset(offset)
            .limit(limit)
        )

        return list(self._session.scalars(statement))

    def list_by_source(
        self,
        organization_id: UUID,
        source_id: UUID,
    ) -> builtins.list[Embedding]:
        """List embeddings for a source.

        Args:
            organization_id: Organization identifier.
            source_id: Source identifier.

        Returns:
            A list of embeddings.
        """
        statement = (
            select(Embedding)
            .where(
                Embedding.organization_id == organization_id,
                Embedding.source_id == source_id,
            )
            .order_by(
                Embedding.created_at.desc(),
            )
        )

        return list(self._session.scalars(statement))

    def exists(
        self,
        organization_id: UUID,
        source_id: UUID,
    ) -> bool:
        """Determine whether an embedding exists.

        Args:
            organization_id: Organization identifier.
            source_id: Source identifier.

        Returns:
            ``True`` if an embedding exists; otherwise, ``False``.
        """
        statement = select(Embedding.id).where(
            Embedding.organization_id == organization_id,
            Embedding.source_id == source_id,
        )

        return self._session.scalar(statement) is not None

    def count(
        self,
        organization_id: UUID,
    ) -> int:
        """Count embeddings for an organization.

        Args:
            organization_id: Organization identifier.

        Returns:
            Number of embeddings.
        """
        statement = (
            select(func.count())
            .select_from(Embedding)
            .where(
                Embedding.organization_id == organization_id,
            )
        )

        result = self._session.scalar(statement)

        return int(result or 0)

    def update(
        self,
        embedding: Embedding,
    ) -> Embedding:
        """Update an embedding.

        Args:
            embedding: Embedding to update.

        Returns:
            The updated embedding.
        """
        self._session.commit()
        self._session.refresh(embedding)

        return embedding

    def delete(
        self,
        embedding: Embedding,
    ) -> None:
        """Delete an embedding.

        Args:
            embedding: Embedding to delete.
        """
        self._session.delete(embedding)
        self._session.commit()
