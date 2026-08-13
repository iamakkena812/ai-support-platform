"""Repository for the AI Documents module."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.ai.documents.models import Document


class DocumentRepository:
    """Repository for document operations."""

    def __init__(
        self,
        db: Session,
    ) -> None:
        """Initialize the repository.

        Args:
            db: Database session.
        """
        self._db = db

    def create(
        self,
        document: Document,
    ) -> Document:
        """Create a document.

        Args:
            document: Document to create.

        Returns:
            Persisted document.
        """
        self._db.add(document)
        self._db.commit()
        self._db.refresh(document)

        return document

    def list(
        self,
        organization_id: UUID,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> list[Document]:
        """Return documents belonging to an organization.

        Args:
            organization_id: Organization identifier.
            offset: Result offset.
            limit: Maximum number of results.

        Returns:
            Documents.
        """
        statement = (
            select(Document)
            .where(Document.organization_id == organization_id)
            .order_by(Document.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        return list(self._db.scalars(statement).all())

    def get(
        self,
        document_id: UUID,
        organization_id: UUID,
    ) -> Document | None:
        """Return a document scoped to an organization.

        Args:
            document_id: Document identifier.
            organization_id: Organization identifier.

        Returns:
            Document if found.
        """
        statement = select(Document).where(
            Document.id == document_id,
            Document.organization_id == organization_id,
        )

        return self._db.scalar(statement)

    def update(
        self,
        document: Document,
    ) -> Document:
        """Update a document.

        Args:
            document: Document to update.

        Returns:
            Updated document.
        """
        self._db.add(document)
        self._db.commit()
        self._db.refresh(document)

        return document

    def delete(
        self,
        document: Document,
    ) -> None:
        """Delete a document.

        Args:
            document: Document to delete.
        """
        self._db.delete(document)
        self._db.commit()

    def count(
        self,
        organization_id: UUID,
    ) -> int:
        """Return the total number of documents in an organization.

        Args:
            organization_id: Organization identifier.

        Returns:
            Total documents.
        """
        statement = (
            select(func.count())
            .select_from(Document)
            .where(Document.organization_id == organization_id)
        )

        return self._db.scalar(statement) or 0

    def statistics(
        self,
        organization_id: UUID,
    ) -> dict[str, int]:
        """Return document statistics for an organization.

        Args:
            organization_id: Organization identifier.

        Returns:
            Document statistics.
        """
        total = self.count(organization_id)

        indexed = (
            self._db.scalar(
                select(func.count()).where(
                    Document.organization_id == organization_id,
                    Document.status == "indexed",
                ),
            )
            or 0
        )

        failed = (
            self._db.scalar(
                select(func.count()).where(
                    Document.organization_id == organization_id,
                    Document.status == "failed",
                ),
            )
            or 0
        )

        deleted = (
            self._db.scalar(
                select(func.count()).where(
                    Document.organization_id == organization_id,
                    Document.status == "deleted",
                ),
            )
            or 0
        )

        return {
            "total_documents": total,
            "indexed_documents": indexed,
            "failed_documents": failed,
            "deleted_documents": deleted,
        }
