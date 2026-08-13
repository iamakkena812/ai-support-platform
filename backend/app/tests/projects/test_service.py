"""Tests for the project service."""

from __future__ import annotations

from typing import cast
from unittest.mock import MagicMock, create_autospec
from uuid import UUID, uuid4

import pytest

from app.models.project import Project
from app.projects.constants import ProjectPriority, ProjectStatus
from app.projects.exceptions import (
    ProjectNameAlreadyExistsError,
    ProjectNotFoundError,
)
from app.projects.schemas import (
    ProjectCreateRequest,
    ProjectUpdateRequest,
)
from app.projects.service import ProjectService
from app.repositories.project import ProjectRepository


@pytest.fixture
def project_repository() -> MagicMock:
    """Return a mocked project repository."""
    return cast(
        MagicMock,
        create_autospec(
            ProjectRepository,
            instance=True,
        ),
    )


@pytest.fixture
def service(
    project_repository: MagicMock,
) -> ProjectService:
    """Return a project service."""
    return ProjectService(
        repository=cast(
            ProjectRepository,
            project_repository,
        ),
    )


@pytest.fixture
def organization_id() -> UUID:
    """Return an organization identifier."""
    return uuid4()


@pytest.fixture
def owner_id() -> UUID:
    """Return an owner identifier."""
    return uuid4()


@pytest.fixture
def create_request() -> ProjectCreateRequest:
    """Return a valid project creation request."""
    return ProjectCreateRequest(
        name="Support Platform",
        description="AI Customer Support Platform",
    )


@pytest.fixture
def project(
    create_request: ProjectCreateRequest,
    organization_id: UUID,
    owner_id: UUID,
) -> Project:
    """Return a mocked project."""
    project = MagicMock(spec=Project)

    project.id = uuid4()
    project.name = create_request.name
    project.key = "SUPPORTPLA"
    project.description = create_request.description
    project.organization_id = organization_id
    project.owner_id = owner_id
    project.status = ProjectStatus.ACTIVE
    project.priority = ProjectPriority.MEDIUM
    project.start_date = None
    project.end_date = None

    return project


def test_create_project_success(
    service: ProjectService,
    project_repository: MagicMock,
    create_request: ProjectCreateRequest,
    project: Project,
    organization_id: UUID,
    owner_id: UUID,
) -> None:
    """Create project successfully."""
    project_repository.exists_by_name.return_value = False
    project_repository.exists_by_key.return_value = False
    project_repository.create.return_value = project

    result = service.create_project(
        create_request,
        organization_id=organization_id,
        owner_id=owner_id,
    )

    assert result is project

    project_repository.exists_by_name.assert_called_once_with(
        create_request.name,
    )
    project_repository.create.assert_called_once()

    created_project = project_repository.create.call_args.args[0]
    assert created_project.organization_id == organization_id
    assert created_project.owner_id == owner_id
    assert created_project.key


def test_create_project_generates_unique_key(
    service: ProjectService,
    project_repository: MagicMock,
    create_request: ProjectCreateRequest,
    project: Project,
    organization_id: UUID,
    owner_id: UUID,
) -> None:
    """Generate a fresh key when the derived key already exists."""
    project_repository.exists_by_name.return_value = False
    project_repository.exists_by_key.side_effect = [True, False]
    project_repository.create.return_value = project

    service.create_project(
        create_request,
        organization_id=organization_id,
        owner_id=owner_id,
    )

    created_project = project_repository.create.call_args.args[0]
    assert created_project.key.endswith("2")


def test_create_project_duplicate_name(
    service: ProjectService,
    project_repository: MagicMock,
    create_request: ProjectCreateRequest,
    organization_id: UUID,
    owner_id: UUID,
) -> None:
    """Raise if project name already exists."""
    project_repository.exists_by_name.return_value = True

    with pytest.raises(ProjectNameAlreadyExistsError):
        service.create_project(
            create_request,
            organization_id=organization_id,
            owner_id=owner_id,
        )

    project_repository.create.assert_not_called()


def test_get_project_success(
    service: ProjectService,
    project_repository: MagicMock,
    project: Project,
) -> None:
    """Return a project by identifier."""
    project_repository.get.return_value = project

    result = service.get_project(project.id)

    assert result is project

    project_repository.get.assert_called_once_with(project.id)


def test_get_project_not_found(
    service: ProjectService,
    project_repository: MagicMock,
) -> None:
    """Raise when the project does not exist."""
    project_repository.get.return_value = None

    with pytest.raises(ProjectNotFoundError):
        service.get_project(uuid4())


def test_list_projects(
    service: ProjectService,
    project_repository: MagicMock,
    project: Project,
) -> None:
    """Return a paginated list of projects."""
    project_repository.list.return_value = [project]

    result = service.list_projects()

    assert result == [project]

    project_repository.list.assert_called_once_with(
        offset=0,
        limit=100,
        search=None,
        status=None,
        priority=None,
    )


def test_update_project_success(
    service: ProjectService,
    project_repository: MagicMock,
    project: Project,
) -> None:
    """Update a project successfully."""
    request = ProjectUpdateRequest(
        name="Updated Project",
        description="Updated description",
        status=ProjectStatus.ARCHIVED,
        priority=ProjectPriority.HIGH,
    )

    project_repository.get.return_value = project
    project_repository.exists_by_name.return_value = False
    project_repository.update.return_value = project

    result = service.update_project(
        project.id,
        request,
    )

    assert result is project
    assert project.name == request.name
    assert project.description == request.description
    assert project.status == request.status
    assert project.priority == request.priority

    project_repository.update.assert_called_once_with(project)


def test_update_project_not_found(
    service: ProjectService,
    project_repository: MagicMock,
) -> None:
    """Raise when updating a missing project."""
    project_repository.get.return_value = None

    with pytest.raises(ProjectNotFoundError):
        service.update_project(
            uuid4(),
            ProjectUpdateRequest(),
        )

    project_repository.update.assert_not_called()


def test_delete_project_success(
    service: ProjectService,
    project_repository: MagicMock,
    project: Project,
) -> None:
    """Delete a project."""
    project_repository.get.return_value = project

    service.delete_project(project.id)

    project_repository.delete.assert_called_once_with(project)


def test_count_projects(
    service: ProjectService,
    project_repository: MagicMock,
) -> None:
    """Return the total number of projects."""
    project_repository.count.return_value = 7

    result = service.count_projects()

    assert result == 7

    project_repository.count.assert_called_once_with(
        search=None,
        status=None,
        priority=None,
    )


def test_get_statistics(
    service: ProjectService,
    project_repository: MagicMock,
) -> None:
    """Return aggregate project statistics."""
    project_repository.count.return_value = 10
    project_repository.count_by_status.side_effect = [4, 3, 2]

    result = service.get_statistics()

    assert result.total == 10
    assert result.active == 4
    assert result.completed == 3
    assert result.archived == 2
