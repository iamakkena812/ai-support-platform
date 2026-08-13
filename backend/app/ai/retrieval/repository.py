"""Repository for the AI Retrieval module."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.ai.embeddings.models import Embedding
from app.ai.retrieval.constants import MAX_LIMIT


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

    def search_by_terms(
        self,
        organization_id: UUID,
        terms: list[str],
        *,
        limit: int = MAX_LIMIT,
    ) -> list[Embedding]:
        """Return org-scoped embeddings whose content matches at least one term.

        A term match here is a case-insensitive substring match, used as a
        candidate filter. Precise relevance scoring happens in the service.

        Args:
            organization_id: Organization scope.
            terms: Normalized query terms to match against content.
            limit: Maximum number of candidate rows to return.

        Returns:
            Candidate embeddings, unranked.
        """
        statement = select(Embedding).where(
            Embedding.organization_id == organization_id,
        )

        if terms:
            statement = statement.where(
                or_(*[Embedding.content.ilike(f"%{term}%") for term in terms]),
            )

        statement = statement.limit(limit)

        return list(self._db.scalars(statement).all())

    def metadata_search(
        self,
        organization_id: UUID,
        metadata: dict[str, object],
        *,
        limit: int = 10,
    ) -> list[Embedding]:
        """Search embeddings by metadata.

        Args:
            organization_id: Organization scope.
            metadata: Metadata filters.
            limit: Maximum number of results.

        Returns:
            Matching embeddings.
        """
        statement = select(Embedding).where(
            Embedding.organization_id == organization_id,
        )

        for key, value in metadata.items():
            statement = statement.where(
                Embedding.metadata_json[key].as_string() == str(value),
            )

        statement = statement.limit(limit)

        return list(self._db.scalars(statement).all())

    def count_documents(self, organization_id: UUID) -> int:
        """Return the total indexed documents for an organization.

        Args:
            organization_id: Organization scope.

        Returns:
            Total indexed documents.
        """
        statement = (
            select(func.count())
            .select_from(Embedding)
            .where(Embedding.organization_id == organization_id)
        )

        return self._db.scalar(statement) or 0
