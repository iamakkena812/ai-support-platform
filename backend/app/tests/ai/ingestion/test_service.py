"""Tests for the AI Ingestion service."""

from __future__ import annotations

from uuid import uuid4

import pytest

from app.ai.ingestion.exceptions import IngestionNotFoundError
from app.ai.ingestion.models import IngestionJob
from app.ai.ingestion.schemas import (
    IngestionCreateRequest,
    IngestionUpdateRequest,
)
from app.ai.ingestion.service import IngestionService
from app.models.user import User


def test_create_job(
    ingestion_service: IngestionService,
    ingestion_create_request: IngestionCreateRequest,
    user: User,
) -> None:
    """It should create an ingestion job."""
    response = ingestion_service.create_job(
        ingestion_create_request,
        created_by=user.id,
    )

    assert response.id is not None
    assert response.organization_id == ingestion_create_request.organization_id
    assert response.document_id == ingestion_create_request.document_id
    assert response.file_type == ingestion_create_request.file_type
    assert response.status == "registered"


def test_get_job(
    ingestion_service: IngestionService,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should return an ingestion job."""
    response = ingestion_service.get_job(
        persisted_ingestion_job.id,
    )

    assert response.id == persisted_ingestion_job.id


def test_get_unknown_job(
    ingestion_service: IngestionService,
) -> None:
    """Unknown job should raise."""
    with pytest.raises(IngestionNotFoundError):
        ingestion_service.get_job(
            uuid4(),
        )


def test_list_jobs(
    ingestion_service: IngestionService,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should list jobs."""
    jobs = ingestion_service.list_jobs()

    assert len(jobs) >= 1
    assert any(job.id == persisted_ingestion_job.id for job in jobs)


def test_update_job(
    ingestion_service: IngestionService,
    persisted_ingestion_job: IngestionJob,
    ingestion_update_request: IngestionUpdateRequest,
    user: User,
) -> None:
    """It should update a job."""
    response = ingestion_service.update_job(
        persisted_ingestion_job.id,
        ingestion_update_request,
        updated_by=user.id,
    )

    assert response.status == "processing"
    assert response.chunks_created == 12
    assert response.embeddings_created == 12


def test_update_unknown_job(
    ingestion_service: IngestionService,
    ingestion_update_request: IngestionUpdateRequest,
    user: User,
) -> None:
    """Updating unknown job raises."""
    with pytest.raises(IngestionNotFoundError):
        ingestion_service.update_job(
            uuid4(),
            ingestion_update_request,
            updated_by=user.id,
        )


def test_start_job(
    ingestion_service: IngestionService,
    persisted_ingestion_job: IngestionJob,
    user: User,
) -> None:
    """It should start processing."""
    response = ingestion_service.start_job(
        persisted_ingestion_job.id,
        updated_by=user.id,
    )

    assert response.status == "processing"


def test_complete_job(
    ingestion_service: IngestionService,
    persisted_ingestion_job: IngestionJob,
    user: User,
) -> None:
    """It should complete a job."""
    response = ingestion_service.complete_job(
        persisted_ingestion_job.id,
        updated_by=user.id,
    )

    assert response.status == "completed"
    assert response.completed_at is not None


def test_fail_job(
    ingestion_service: IngestionService,
    persisted_ingestion_job: IngestionJob,
    user: User,
) -> None:
    """It should fail a job."""
    response = ingestion_service.fail_job(
        persisted_ingestion_job.id,
        "Embedding generation failed",
        updated_by=user.id,
    )

    assert response.status == "failed"
    assert response.error_message == "Embedding generation failed"


def test_delete_job(
    ingestion_service: IngestionService,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should delete a job."""
    ingestion_service.delete_job(
        persisted_ingestion_job.id,
    )

    with pytest.raises(IngestionNotFoundError):
        ingestion_service.get_job(
            persisted_ingestion_job.id,
        )


def test_delete_unknown_job(
    ingestion_service: IngestionService,
) -> None:
    """Deleting unknown job raises."""
    with pytest.raises(IngestionNotFoundError):
        ingestion_service.delete_job(
            uuid4(),
        )


def test_statistics(
    ingestion_service: IngestionService,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should return statistics."""
    stats = ingestion_service.statistics()

    assert "total_jobs" in stats
    assert "completed_jobs" in stats
    assert "processing_jobs" in stats
    assert "failed_jobs" in stats


def test_build_response_contains_metadata(
    ingestion_service: IngestionService,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """Metadata should be mapped correctly."""
    response = ingestion_service.get_job(
        persisted_ingestion_job.id,
    )

    assert isinstance(response.metadata, dict)


def test_multiple_jobs(
    ingestion_service: IngestionService,
    ingestion_create_request: IngestionCreateRequest,
    user: User,
) -> None:
    """Service should create multiple jobs."""
    ingestion_service.create_job(
        ingestion_create_request,
        created_by=user.id,
    )

    ingestion_service.create_job(
        ingestion_create_request,
        created_by=user.id,
    )

    jobs = ingestion_service.list_jobs()

    assert len(jobs) >= 2


def test_update_metadata(
    ingestion_service: IngestionService,
    persisted_ingestion_job: IngestionJob,
    user: User,
) -> None:
    """Metadata updates should be persisted."""
    response = ingestion_service.update_job(
        persisted_ingestion_job.id,
        IngestionUpdateRequest(
            metadata={
                "language": "en",
                "pages": 10,
            },
        ),
        updated_by=user.id,
    )

    assert response.metadata == {
        "language": "en",
        "pages": 10,
    }
