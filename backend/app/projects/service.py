"""Project service."""

from __future__ import annotations

from uuid import UUID

from app.models.project import Project
from app.projects.constants import (
    PROJECT_KEY_MAX_LENGTH,
    PROJECT_KEY_MIN_LENGTH,
    ProjectPriority,
    ProjectStatus,
)
from app.projects.exceptions import (
    ProjectNameAlreadyExistsError,
    ProjectNotFoundError,
)
from app.projects.schemas import (
    ProjectCreateRequest,
    ProjectStatisticsResponse,
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

    def _generate_unique_key(
        self,
        name: str,
    ) -> str:
        """Derive a unique, short project key from its name."""
        base = "".join(
            character
            for character in name.upper()
            if character.isalnum()
        )[:PROJECT_KEY_MAX_LENGTH]

        if len(base) < PROJECT_KEY_MIN_LENGTH:
            base = (base + "PROJECT")[:PROJECT_KEY_MAX_LENGTH]

        candidate = base
        suffix = 1

        while self._repository.exists_by_key(candidate):
            suffix += 1
            suffix_text = str(suffix)
            trimmed = base[: PROJECT_KEY_MAX_LENGTH - len(suffix_text)]
            candidate = f"{trimmed}{suffix_text}"

        return candidate

    def create_project(
        self,
        request: ProjectCreateRequest,
        *,
        organization_id: UUID,
        owner_id: UUID,
    ) -> Project:
        """Create a new project owned by the requesting user."""
        if self._repository.exists_by_name(request.name):
            raise ProjectNameAlreadyExistsError(
                "Project name already exists.",
            )

        project = Project(
            name=request.name,
            key=self._generate_unique_key(request.name),
            description=request.description,
            organization_id=organization_id,
            owner_id=owner_id,
            priority=request.priority,
            start_date=request.start_date,
            end_date=request.end_date,
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
        search: str | None = None,
        status: ProjectStatus | None = None,
        priority: ProjectPriority | None = None,
    ) -> list[Project]:
        """Return a list of projects, optionally filtered."""
        return self._repository.list(
            offset=offset,
            limit=limit,
            search=search,
            status=status,
            priority=priority,
        )

    def update_project(
        self,
        project_id: UUID,
        request: ProjectUpdateRequest,
    ) -> Project:
        """Update a project."""
        project = self.get_project(project_id)

        if request.name is not None and request.name != project.name:
            if self._repository.exists_by_name(request.name):
                raise ProjectNameAlreadyExistsError(
                    "Project name already exists.",
                )
            project.name = request.name

        if request.description is not None:
            project.description = request.description

        if request.status is not None:
            project.status = request.status

        if request.priority is not None:
            project.priority = request.priority

        if request.start_date is not None:
            project.start_date = request.start_date

        if request.end_date is not None:
            project.end_date = request.end_date

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
        *,
        search: str | None = None,
        status: ProjectStatus | None = None,
        priority: ProjectPriority | None = None,
    ) -> int:
        """Return the total number of active projects, optionally filtered."""
        return self._repository.count(
            search=search,
            status=status,
            priority=priority,
        )

    def get_statistics(
        self,
    ) -> ProjectStatisticsResponse:
        """Return aggregate project statistics."""
        return ProjectStatisticsResponse(
            total=self._repository.count(),
            active=self._repository.count_by_status(ProjectStatus.ACTIVE),
            completed=self._repository.count_by_status(ProjectStatus.COMPLETED),
            archived=self._repository.count_by_status(ProjectStatus.ARCHIVED),
        )
