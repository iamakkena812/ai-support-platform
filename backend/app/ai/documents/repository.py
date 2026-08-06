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
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> list[Document]:
        """Return documents.

        Args:
            offset: Result offset.
            limit: Maximum number of results.

        Returns:
            Documents.
        """
        statement = select(Document).offset(offset).limit(limit)

        return list(self._db.scalars(statement).all())

    def get(
        self,
        document_id: UUID,
    ) -> Document | None:
        """Return a document.

        Args:
            document_id: Document identifier.

        Returns:
            Document if found.
        """
        statement = select(Document).where(Document.id == document_id)

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

    def count(self) -> int:
        """Return the total number of documents.

        Returns:
            Total documents.
        """
        statement = select(func.count()).select_from(Document)

        return self._db.scalar(statement) or 0

    def statistics(self) -> dict[str, int]:
        """Return document statistics.

        Returns:
            Document statistics.
        """
        total = self.count()

        indexed = (
            self._db.scalar(
                select(func.count()).where(
                    Document.status == "indexed",
                ),
            )
            or 0
        )

        failed = (
            self._db.scalar(
                select(func.count()).where(
                    Document.status == "failed",
                ),
            )
            or 0
        )

        deleted = (
            self._db.scalar(
                select(func.count()).where(
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
