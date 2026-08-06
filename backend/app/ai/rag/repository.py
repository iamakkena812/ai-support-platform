"""Repository for the AI RAG module."""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.ai.embeddings.models import Embedding


class RAGRepository:
    """Repository for AI RAG operations."""

    def __init__(
        self,
        db: Session,
    ) -> None:
        """Initialize the repository.

        Args:
            db: Database session.
        """
        self._db = db

    def list_embeddings(
        self,
        *,
        offset: int = 0,
        limit: int = 10,
    ) -> list[Embedding]:
        """Return embeddings available for retrieval.

        Args:
            offset: Pagination offset.
            limit: Maximum number of records.

        Returns:
            List of embeddings.
        """
        return self._db.query(Embedding).offset(offset).limit(limit).all()

    def get_embedding_count(
        self,
    ) -> int:
        """Return total number of embeddings.

        Returns:
            Total embedding count.
        """
        return self._db.query(Embedding).count()
