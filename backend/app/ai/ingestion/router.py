"""Router for the AI Ingestion module."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.ai.ingestion.dependencies import IngestionServiceDep
from app.ai.ingestion.exceptions import (
    IngestionNotFoundError,
)
from app.ai.ingestion.schemas import (
    IngestionCreateRequest,
    IngestionListResponse,
    IngestionResponse,
    IngestionStatisticsResponse,
    IngestionUpdateRequest,
)
from app.auth.dependencies import CurrentActiveUserDependency

router = APIRouter(
    prefix="/ai/ingestion",
    tags=["AI Ingestion"],
)


@router.post(
    "/",
    response_model=IngestionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_ingestion_job(
    request: IngestionCreateRequest,
    service: IngestionServiceDep,
    current_user: CurrentActiveUserDependency,
) -> IngestionResponse:
    """Create ingestion job."""
    return service.create_job(
        request,
        created_by=current_user.id,
    )


@router.get(
    "/",
    response_model=IngestionListResponse,
)
def list_ingestion_jobs(
    service: IngestionServiceDep,
    _: CurrentActiveUserDependency,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> IngestionListResponse:
    """List ingestion jobs."""
    offset = (page - 1) * page_size

    items = service.list_jobs(
        offset=offset,
        limit=page_size,
    )

    return IngestionListResponse(
        items=items,
        total=service.statistics()["total_jobs"],
        page=page,
        page_size=page_size,
    )


@router.get(
    "/statistics",
    response_model=IngestionStatisticsResponse,
)
def ingestion_statistics(
    service: IngestionServiceDep,
    _: CurrentActiveUserDependency,
) -> IngestionStatisticsResponse:
    """Return ingestion statistics."""
    return IngestionStatisticsResponse(
        **service.statistics(),
    )


@router.get(
    "/{job_id}",
    response_model=IngestionResponse,
)
def get_ingestion_job(
    job_id: UUID,
    service: IngestionServiceDep,
    _: CurrentActiveUserDependency,
) -> IngestionResponse:
    """Get ingestion job."""
    try:
        return service.get_job(job_id)
    except IngestionNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingestion job not found.",
        ) from exc


@router.patch(
    "/{job_id}",
    response_model=IngestionResponse,
)
def update_ingestion_job(
    job_id: UUID,
    request: IngestionUpdateRequest,
    service: IngestionServiceDep,
    current_user: CurrentActiveUserDependency,
) -> IngestionResponse:
    """Update ingestion job."""
    try:
        return service.update_job(
            job_id,
            request,
            updated_by=current_user.id,
        )
    except IngestionNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingestion job not found.",
        ) from exc


@router.delete(
    "/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_ingestion_job(
    job_id: UUID,
    service: IngestionServiceDep,
    _: CurrentActiveUserDependency,
) -> None:
    """Delete ingestion job."""
    try:
        service.delete_job(job_id)
    except IngestionNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingestion job not found.",
        ) from exc
