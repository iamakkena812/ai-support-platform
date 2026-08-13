"""Project router."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.auth.dependencies import CurrentActiveUserDependency
from app.projects.constants import ProjectPriority, ProjectStatus
from app.projects.dependencies import ProjectServiceDependency
from app.projects.exceptions import (
    ProjectNameAlreadyExistsError,
    ProjectNotFoundError,
)
from app.projects.schemas import (
    ProjectCreateRequest,
    ProjectDeleteResponse,
    ProjectListResponse,
    ProjectResponse,
    ProjectStatisticsResponse,
    ProjectUpdateRequest,
)

router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    request: ProjectCreateRequest,
    service: ProjectServiceDependency,
    current_user: CurrentActiveUserDependency,
) -> ProjectResponse:
    """Create a project owned by the requesting user."""
    try:
        project = service.create_project(
            request,
            organization_id=current_user.organization_id,
            owner_id=current_user.id,
        )
    except ProjectNameAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    return ProjectResponse.from_project(project)


@router.get(
    "/statistics",
    response_model=ProjectStatisticsResponse,
)
def get_project_statistics(
    service: ProjectServiceDependency,
    _: CurrentActiveUserDependency,
) -> ProjectStatisticsResponse:
    """Return aggregate project statistics."""
    return service.get_statistics()


@router.get(
    "",
    response_model=ProjectListResponse,
)
def list_projects(
    service: ProjectServiceDependency,
    _: CurrentActiveUserDependency,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100, alias="pageSize"),
    search: str | None = Query(default=None),
    status: ProjectStatus | None = Query(default=None),
    priority: ProjectPriority | None = Query(default=None),
) -> ProjectListResponse:
    """Return a paginated list of projects, optionally filtered."""
    offset = (page - 1) * page_size

    projects = service.list_projects(
        offset=offset,
        limit=page_size,
        search=search,
        status=status,
        priority=priority,
    )
    total = service.count_projects(
        search=search,
        status=status,
        priority=priority,
    )

    return ProjectListResponse(
        items=[ProjectResponse.from_project(project) for project in projects],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=-(-total // page_size) if total else 0,
    )


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
    project_id: UUID,
    service: ProjectServiceDependency,
    _: CurrentActiveUserDependency,
) -> ProjectResponse:
    """Get a project."""
    try:
        project = service.get_project(project_id)
    except ProjectNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return ProjectResponse.from_project(project)


@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: UUID,
    request: ProjectUpdateRequest,
    service: ProjectServiceDependency,
    _: CurrentActiveUserDependency,
) -> ProjectResponse:
    """Update a project."""
    try:
        project = service.update_project(
            project_id,
            request,
        )
    except ProjectNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except ProjectNameAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    return ProjectResponse.from_project(project)


@router.delete(
    "/{project_id}",
    response_model=ProjectDeleteResponse,
)
def delete_project(
    project_id: UUID,
    service: ProjectServiceDependency,
    _: CurrentActiveUserDependency,
) -> ProjectDeleteResponse:
    """Delete a project."""
    try:
        service.delete_project(project_id)
    except ProjectNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return ProjectDeleteResponse(
        message="Project deleted successfully.",
    )
