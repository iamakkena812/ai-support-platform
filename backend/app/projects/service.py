"""Project service."""

from __future__ import annotations

from uuid import UUID

from app.models.project import Project
from app.projects.exceptions import (
    ProjectKeyAlreadyExistsError,
    ProjectNameAlreadyExistsError,
    ProjectNotFoundError,
)
from app.projects.schemas import (
    ProjectCreateRequest,
    ProjectUpdateRequest,
)
from app.repositories.project import ProjectRepository


class ProjectService:
    """Service for managing projects."""

    def __init__(
        self,
        repository: ProjectRepository,
    ) -> None:
        """Initialize the project service."""
        self._repository = repository

    def create_project(
        self,
        request: ProjectCreateRequest,
    ) -> Project:
        """Create a new project."""
        if self._repository.exists_by_name(request.name):
            raise ProjectNameAlreadyExistsError(
                "Project name already exists.",
            )

        if self._repository.exists_by_key(request.key):
            raise ProjectKeyAlreadyExistsError(
                "Project key already exists.",
            )

        project = Project(
            name=request.name,
            key=request.key,
            description=request.description,
            organization_id=request.organization_id,
            owner_id=request.owner_id,
        )

        return self._repository.create(project)

    def get_project(
        self,
        project_id: UUID,
    ) -> Project:
        """Return a project by ID."""
        project = self._repository.get(project_id)

        if project is None:
            raise ProjectNotFoundError(
                "Project not found.",
            )

        return project

    def list_projects(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> list[Project]:
        """Return a list of projects."""
        return self._repository.list(
            offset=offset,
            limit=limit,
        )

    def update_project(
        self,
        project_id: UUID,
        request: ProjectUpdateRequest,
    ) -> Project:
        """Update a project."""
        project = self.get_project(project_id)

        if request.name is not None:
            project.name = request.name

        if request.description is not None:
            project.description = request.description

        if request.owner_id is not None:
            project.owner_id = request.owner_id

        if request.is_active is not None:
            project.is_active = request.is_active

        return self._repository.update(project)

    def delete_project(
        self,
        project_id: UUID,
    ) -> None:
        """Delete a project."""
        project = self.get_project(project_id)
        self._repository.delete(project)

    def count_projects(
        self,
    ) -> int:
        """Return the total number of active projects."""
        return self._repository.count()
