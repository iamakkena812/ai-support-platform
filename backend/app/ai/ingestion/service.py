"""Service for the AI Ingestion module."""

from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from app.ai.ingestion.exceptions import IngestionNotFoundError
from app.ai.ingestion.models import IngestionJob
from app.ai.ingestion.repository import IngestionRepository
from app.ai.ingestion.schemas import (
    IngestionCreateRequest,
    IngestionResponse,
    IngestionUpdateRequest,
)


class IngestionService:
    """Business logic for AI ingestion."""

    def __init__(
        self,
        repository: IngestionRepository,
    ) -> None:
        """Initialize the service.

        Args:
            repository: Ingestion repository.
        """
        self.repository = repository

    def create_job(
        self,
        request: IngestionCreateRequest,
        *,
        created_by: UUID | None,
    ) -> IngestionResponse:
        """Create a new ingestion job."""
        job = IngestionJob(
            organization_id=request.organization_id,
            document_id=request.document_id,
            file_type=request.file_type,
            chunk_size=request.chunk_size,
            chunk_overlap=request.chunk_overlap,
            metadata_json=request.metadata,
            created_by=created_by,
            updated_by=created_by,
        )

        job = self.repository.create(job)

        return self._build_response(job)

    def list_jobs(
        self,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> list[IngestionResponse]:
        """Return ingestion jobs."""
        return [
            self._build_response(job)
            for job in self.repository.list(
                offset=offset,
                limit=limit,
            )
        ]

    def get_job(
        self,
        job_id: UUID,
    ) -> IngestionResponse:
        """Return an ingestion job."""
        job = self.repository.get(job_id)

        if job is None:
            raise IngestionNotFoundError

        return self._build_response(job)

    def update_job(
        self,
        job_id: UUID,
        request: IngestionUpdateRequest,
        *,
        updated_by: UUID | None,
    ) -> IngestionResponse:
        """Update an ingestion job."""
        job = self.repository.get(job_id)

        if job is None:
            raise IngestionNotFoundError

        data = request.model_dump(
            exclude_unset=True,
        )

        if "metadata" in data:
            data["metadata_json"] = data.pop("metadata")

        for key, value in data.items():
            setattr(job, key, value)

        job.updated_by = updated_by

        job = self.repository.update(job)

        return self._build_response(job)

    def start_job(
        self,
        job_id: UUID,
        *,
        updated_by: UUID | None,
    ) -> IngestionResponse:
        """Mark an ingestion job as processing."""
        return self.update_job(
            job_id,
            IngestionUpdateRequest(
                status="processing",
            ),
            updated_by=updated_by,
        )

    def complete_job(
        self,
        job_id: UUID,
        *,
        updated_by: UUID | None,
    ) -> IngestionResponse:
        """Mark an ingestion job as completed."""
        job = self.repository.get(job_id)

        if job is None:
            raise IngestionNotFoundError

        job.status = "completed"
        job.completed_at = datetime.now(UTC)
        job.updated_by = updated_by

        job = self.repository.update(job)

        return self._build_response(job)

    def fail_job(
        self,
        job_id: UUID,
        message: str,
        *,
        updated_by: UUID | None,
    ) -> IngestionResponse:
        """Mark an ingestion job as failed."""
        job = self.repository.get(job_id)

        if job is None:
            raise IngestionNotFoundError

        job.status = "failed"
        job.error_message = message
        job.updated_by = updated_by

        job = self.repository.update(job)

        return self._build_response(job)

    def delete_job(
        self,
        job_id: UUID,
    ) -> None:
        """Delete an ingestion job."""
        job = self.repository.get(job_id)

        if job is None:
            raise IngestionNotFoundError

        self.repository.delete(job)

    def statistics(self) -> dict[str, int]:
        """Return ingestion statistics."""
        return self.repository.statistics()

    @staticmethod
    def _build_response(
        job: IngestionJob,
    ) -> IngestionResponse:
        """Convert an ingestion model to a response."""
        return IngestionResponse.model_validate(
            {
                **job.__dict__,
                "metadata": job.metadata_json,
            },
        )
