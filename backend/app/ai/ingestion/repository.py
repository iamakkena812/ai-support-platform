"""Repository for the AI Ingestion module."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.ai.ingestion.models import IngestionJob
from app.repositories.base import BaseRepository


class IngestionRepository(BaseRepository[IngestionJob]):
    """Repository for AI ingestion jobs."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize the repository.

        Args:
            session: Database session.
        """
        super().__init__(session, IngestionJob)

    def create(
        self,
        entity: IngestionJob,
    ) -> IngestionJob:
        """Persist an ingestion job.

        Args:
            entity: Ingestion job entity.

        Returns:
            Persisted ingestion job.
        """
        return super().create(entity)

    def get(
        self,
        job_id: UUID,
    ) -> IngestionJob | None:
        """Return an ingestion job by ID.

        Args:
            job_id: Ingestion job identifier.

        Returns:
            The ingestion job if found, otherwise ``None``.
        """
        return self.session.get(IngestionJob, job_id)

    def list(
        self,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> list[IngestionJob]:
        """Return ingestion jobs.

        Args:
            offset: Pagination offset.
            limit: Maximum number of records.

        Returns:
            List of ingestion jobs.
        """
        statement = (
            select(IngestionJob)
            .order_by(IngestionJob.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        return list(
            self.session.scalars(statement).all(),
        )

    def update(
        self,
        entity: IngestionJob,
    ) -> IngestionJob:
        """Update an ingestion job.

        Args:
            entity: Updated ingestion job entity.

        Returns:
            Persisted ingestion job.
        """
        return super().update(entity)

    def delete(
        self,
        entity: IngestionJob,
    ) -> None:
        """Delete an ingestion job.

        Args:
            entity: Ingestion job to delete.
        """
        self.session.delete(entity)
        self.session.commit()

    def count(self) -> int:
        """Return the total number of ingestion jobs."""
        return (
            self.session.scalar(
                select(func.count()).select_from(IngestionJob),
            )
            or 0
        )

    def statistics(self) -> dict[str, int]:
        """Return ingestion statistics."""

        def _count(status: str) -> int:
            return (
                self.session.scalar(
                    select(func.count())
                    .select_from(IngestionJob)
                    .where(IngestionJob.status == status),
                )
                or 0
            )

        return {
            "total_jobs": self.count(),
            "completed_jobs": _count("completed"),
            "processing_jobs": _count("processing"),
            "failed_jobs": _count("failed"),
        }
