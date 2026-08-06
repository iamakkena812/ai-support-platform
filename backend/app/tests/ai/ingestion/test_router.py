"""Tests for the AI Ingestion router."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.ai.ingestion.models import IngestionJob
from app.ai.ingestion.schemas import IngestionCreateRequest


def test_create_ingestion_job(
    authenticated_client: TestClient,
    ingestion_create_request: IngestionCreateRequest,
) -> None:
    """It should create an ingestion job."""
    response = authenticated_client.post(
        "/api/v1/ai/ingestion/",
        json=ingestion_create_request.model_dump(mode="json"),
    )

    assert response.status_code == 201

    payload = response.json()

    assert payload["organization_id"] == str(
        ingestion_create_request.organization_id,
    )
    assert payload["document_id"] == str(
        ingestion_create_request.document_id,
    )
    assert payload["status"] == "registered"


def test_list_ingestion_jobs(
    authenticated_client: TestClient,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should list ingestion jobs."""
    response = authenticated_client.get(
        "/api/v1/ai/ingestion/",
    )

    assert response.status_code == 200

    payload = response.json()

    assert "items" in payload
    assert "total" in payload
    assert payload["total"] >= 1


def test_get_ingestion_job(
    authenticated_client: TestClient,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should return an ingestion job."""
    response = authenticated_client.get(
        f"/api/v1/ai/ingestion/{persisted_ingestion_job.id}",
    )

    assert response.status_code == 200

    payload = response.json()

    assert payload["id"] == str(
        persisted_ingestion_job.id,
    )


def test_get_unknown_ingestion_job(
    authenticated_client: TestClient,
) -> None:
    """Unknown ingestion job returns 404."""
    response = authenticated_client.get(
        f"/api/v1/ai/ingestion/{uuid4()}",
    )

    assert response.status_code == 404


def test_update_ingestion_job(
    authenticated_client: TestClient,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should update an ingestion job."""
    response = authenticated_client.patch(
        f"/api/v1/ai/ingestion/{persisted_ingestion_job.id}",
        json={
            "status": "processing",
            "chunks_created": 25,
            "embeddings_created": 25,
        },
    )

    assert response.status_code == 200

    payload = response.json()

    assert payload["status"] == "processing"
    assert payload["chunks_created"] == 25
    assert payload["embeddings_created"] == 25


def test_update_unknown_ingestion_job(
    authenticated_client: TestClient,
) -> None:
    """Updating unknown ingestion job returns 404."""
    response = authenticated_client.patch(
        f"/api/v1/ai/ingestion/{uuid4()}",
        json={
            "status": "processing",
        },
    )

    assert response.status_code == 404


def test_delete_ingestion_job(
    authenticated_client: TestClient,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should delete an ingestion job."""
    response = authenticated_client.delete(
        f"/api/v1/ai/ingestion/{persisted_ingestion_job.id}",
    )

    assert response.status_code == 204

    response = authenticated_client.get(
        f"/api/v1/ai/ingestion/{persisted_ingestion_job.id}",
    )

    assert response.status_code == 404


def test_delete_unknown_ingestion_job(
    authenticated_client: TestClient,
) -> None:
    """Deleting unknown ingestion job returns 404."""
    response = authenticated_client.delete(
        f"/api/v1/ai/ingestion/{uuid4()}",
    )

    assert response.status_code == 404


def test_statistics(
    authenticated_client: TestClient,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should return ingestion statistics."""
    response = authenticated_client.get(
        "/api/v1/ai/ingestion/statistics",
    )

    assert response.status_code == 200

    payload = response.json()

    assert "total_jobs" in payload
    assert "completed_jobs" in payload
    assert "processing_jobs" in payload
    assert "failed_jobs" in payload


def test_pagination(
    authenticated_client: TestClient,
    persisted_ingestion_job: IngestionJob,
) -> None:
    """It should support pagination."""
    response = authenticated_client.get(
        "/api/v1/ai/ingestion/?page=1&page_size=10",
    )

    assert response.status_code == 200

    payload = response.json()

    assert payload["page"] == 1
    assert payload["page_size"] == 10


def test_invalid_uuid(
    authenticated_client: TestClient,
) -> None:
    """Invalid UUID returns validation error."""
    response = authenticated_client.get(
        "/api/v1/ai/ingestion/not-a-uuid",
    )

    assert response.status_code == 422


def test_create_requires_authentication(
    client: TestClient,
    ingestion_create_request: IngestionCreateRequest,
) -> None:
    """Creating an ingestion job requires authentication."""
    response = client.post(
        "/api/v1/ai/ingestion/",
        json=ingestion_create_request.model_dump(mode="json"),
    )

    assert response.status_code == 401


def test_get_requires_authentication(
    client: TestClient,
) -> None:
    """Retrieving an ingestion job requires authentication."""
    response = client.get(
        f"/api/v1/ai/ingestion/{uuid4()}",
    )

    assert response.status_code == 401


def test_statistics_requires_authentication(
    client: TestClient,
) -> None:
    """Statistics endpoint requires authentication."""
    response = client.get(
        "/api/v1/ai/ingestion/statistics",
    )

    assert response.status_code == 401


def test_validation_error(
    authenticated_client: TestClient,
) -> None:
    """Invalid payload returns validation error."""
    response = authenticated_client.post(
        "/api/v1/ai/ingestion/",
        json={},
    )

    assert response.status_code == 422
