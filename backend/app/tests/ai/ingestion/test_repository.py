"""Tests for the AI Ingestion repository."""

from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from app.ai.ingestion.models import IngestionJob
from app.ai.ingestion.repository import IngestionRepository
from app.models.user import User


def test_create_ingestion_job(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should create an ingestion job."""
    job = IngestionJob(
        organization_id=persisted_ingestion_job.organization_id,
        document_id=persisted_ingestion_job.document_id,
        file_type="application/pdf",
        chunk_size=1024,
        chunk_overlap=128,
        metadata_json={"source": "repository-test"},
        created_by=persisted_ingestion_job.created_by,
        updated_by=persisted_ingestion_job.created_by,
    )

    created = ingestion_repository.create(job)

    assert created.id is not None
    assert created.organization_id == job.organization_id
    assert created.document_id == job.document_id
    assert created.file_type == job.file_type
    assert created.chunk_size == job.chunk_size
    assert created.chunk_overlap == job.chunk_overlap
    assert created.status == "registered"


def test_get_ingestion_job(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should return an ingestion job."""
    job = ingestion_repository.get(
        persisted_ingestion_job.id,
    )

    assert job is not None
    assert job.id == persisted_ingestion_job.id


def test_get_unknown_ingestion_job(
    ingestion_repository: IngestionRepository,
) -> None:
    """Unknown ingestion job returns None."""
    assert ingestion_repository.get(uuid4()) is None


def test_list_ingestion_jobs(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should list ingestion jobs."""
    jobs = ingestion_repository.list()

    assert len(jobs) >= 1
    assert any(job.id == persisted_ingestion_job.id for job in jobs)


def test_count_ingestion_jobs(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should count ingestion jobs."""
    assert ingestion_repository.count() >= 1


def test_update_ingestion_job(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
    user: User,
) -> None:
    """It should update an ingestion job."""
    persisted_ingestion_job.status = "processing"
    persisted_ingestion_job.chunks_created = 12
    persisted_ingestion_job.embeddings_created = 12
    persisted_ingestion_job.updated_by = user.id
    persisted_ingestion_job.metadata_json = {
        "updated": True,
    }

    updated = ingestion_repository.update(
        persisted_ingestion_job,
    )

    assert updated.status == "processing"
    assert updated.chunks_created == 12
    assert updated.embeddings_created == 12
    assert updated.updated_by == user.id
    assert updated.metadata_json == {
        "updated": True,
    }


def test_delete_ingestion_job(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should delete an ingestion job."""
    job_id = persisted_ingestion_job.id

    ingestion_repository.delete(
        persisted_ingestion_job,
    )

    assert ingestion_repository.get(job_id) is None


def test_list_ingestion_jobs_with_pagination(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should support pagination."""
    jobs = ingestion_repository.list(
        offset=0,
        limit=1,
    )

    assert len(jobs) == 1


def test_statistics_empty(
    ingestion_repository: IngestionRepository,
) -> None:
    """Statistics should be empty."""
    assert ingestion_repository.statistics() == {
        "total_jobs": 0,
        "completed_jobs": 0,
        "processing_jobs": 0,
        "failed_jobs": 0,
    }


def test_statistics_registered_job(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """Registered jobs contribute only to total."""
    stats = ingestion_repository.statistics()

    assert stats["total_jobs"] >= 1
    assert stats["completed_jobs"] == 0
    assert stats["processing_jobs"] == 0
    assert stats["failed_jobs"] == 0


def test_statistics_processing_job(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """Processing jobs are counted."""
    persisted_ingestion_job.status = "processing"

    ingestion_repository.update(
        persisted_ingestion_job,
    )

    stats = ingestion_repository.statistics()

    assert stats["processing_jobs"] >= 1


def test_statistics_completed_job(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """Completed jobs are counted."""
    persisted_ingestion_job.status = "completed"
    persisted_ingestion_job.completed_at = datetime.now(
        UTC,
    )

    ingestion_repository.update(
        persisted_ingestion_job,
    )

    stats = ingestion_repository.statistics()

    assert stats["completed_jobs"] >= 1


def test_statistics_failed_job(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """Failed jobs are counted."""
    persisted_ingestion_job.status = "failed"
    persisted_ingestion_job.error_message = "Embedding generation failed"

    ingestion_repository.update(
        persisted_ingestion_job,
    )

    stats = ingestion_repository.statistics()

    assert stats["failed_jobs"] >= 1


def test_multiple_ingestion_jobs(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """Repository should support multiple ingestion jobs."""
    second_job = IngestionJob(
        organization_id=persisted_ingestion_job.organization_id,
        document_id=persisted_ingestion_job.document_id,
        file_type="text/plain",
        chunk_size=512,
        chunk_overlap=100,
        metadata_json={},
        created_by=persisted_ingestion_job.created_by,
        updated_by=persisted_ingestion_job.created_by,
    )

    ingestion_repository.create(
        second_job,
    )

    assert ingestion_repository.count() >= 2


def test_update_metadata(
    ingestion_repository: IngestionRepository,
    persisted_ingestion_job: IngestionJob,
    user: User,
) -> None:
    """Metadata should be updated."""
    persisted_ingestion_job.metadata_json = {
        "language": "en",
        "pages": 24,
    }
    persisted_ingestion_job.updated_by = user.id

    updated = ingestion_repository.update(
        persisted_ingestion_job,
    )

    assert updated.metadata_json == {
        "language": "en",
        "pages": 24,
    }
