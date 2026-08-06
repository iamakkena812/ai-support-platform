"""Project router."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.projects.dependencies import ProjectServiceDependency
from app.projects.exceptions import (
    ProjectKeyAlreadyExistsError,
    ProjectNameAlreadyExistsError,
    ProjectNotFoundError,
)
from app.projects.schemas import (
    ProjectCreateRequest,
    ProjectDeleteResponse,
    ProjectListResponse,
    ProjectResponse,
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
) -> ProjectResponse:
    """Create a project."""
    try:
        project = service.create_project(request)
    except (
        ProjectNameAlreadyExistsError,
        ProjectKeyAlreadyExistsError,
    ) as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    return ProjectResponse.model_validate(project)


@router.get(
    "",
    response_model=ProjectListResponse,
)
def list_projects(
    service: ProjectServiceDependency,
    offset: int = 0,
    limit: int = 100,
) -> ProjectListResponse:
    """List projects."""
    projects = service.list_projects(
        offset=offset,
        limit=limit,
    )

    return ProjectListResponse(
        projects=[ProjectResponse.model_validate(project) for project in projects],
        total=len(projects),
    )


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
    project_id: UUID,
    service: ProjectServiceDependency,
) -> ProjectResponse:
    """Get a project."""
    try:
        project = service.get_project(project_id)
    except ProjectNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return ProjectResponse.model_validate(project)


@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: UUID,
    request: ProjectUpdateRequest,
    service: ProjectServiceDependency,
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

    return ProjectResponse.model_validate(project)


@router.delete(
    "/{project_id}",
    response_model=ProjectDeleteResponse,
)
def delete_project(
    project_id: UUID,
    service: ProjectServiceDependency,
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
