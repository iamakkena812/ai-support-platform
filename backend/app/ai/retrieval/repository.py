"""Repository for the AI Retrieval module."""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.ai.embeddings.models import Embedding


class RetrievalRepository:
    """Repository for retrieval operations."""

    def __init__(
        self,
        db: Session,
    ) -> None:
        """Initialize the repository.

        Args:
            db: Database session.
        """
        self._db = db

    def semantic_search(
        self,
        *,
        offset: int = 0,
        limit: int = 10,
    ) -> list[Embedding]:
        """Return embeddings for semantic retrieval.

        Args:
            offset: Result offset.
            limit: Maximum number of results.

        Returns:
            Retrieved embeddings.
        """
        statement = select(Embedding).offset(offset).limit(limit)

        return list(self._db.scalars(statement).all())

    def hybrid_search(
        self,
        *,
        offset: int = 0,
        limit: int = 10,
    ) -> list[Embedding]:
        """Return embeddings for hybrid retrieval.

        Args:
            offset: Result offset.
            limit: Maximum number of results.

        Returns:
            Retrieved embeddings.
        """
        statement = select(Embedding).offset(offset).limit(limit)

        return list(self._db.scalars(statement).all())

    def metadata_search(
        self,
        metadata: dict[str, object],
        *,
        limit: int = 10,
    ) -> list[Embedding]:
        """Search embeddings by metadata.

        Args:
            metadata: Metadata filters.
            limit: Maximum number of results.

        Returns:
            Matching embeddings.
        """
        statement = select(Embedding)

        for key, value in metadata.items():
            statement = statement.where(
                Embedding.metadata_json[key].as_string() == str(value),
            )

        statement = statement.limit(limit)

        return list(self._db.scalars(statement).all())

    def count_documents(self) -> int:
        """Return the total indexed documents.

        Returns:
            Total indexed documents.
        """
        statement = select(func.count()).select_from(Embedding)

        return self._db.scalar(statement) or 0
