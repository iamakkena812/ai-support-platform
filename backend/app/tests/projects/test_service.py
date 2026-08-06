"""Tests for the project service."""

from __future__ import annotations

from typing import cast
from unittest.mock import MagicMock, create_autospec
from uuid import uuid4

import pytest

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
def create_request() -> ProjectCreateRequest:
    """Return a valid project creation request."""
    return ProjectCreateRequest(
        name="Support Platform",
        key="SUP",
        description="AI Customer Support Platform",
        organization_id=uuid4(),
        owner_id=uuid4(),
    )


@pytest.fixture
def project(
    create_request: ProjectCreateRequest,
) -> Project:
    """Return a mocked project."""
    project = MagicMock(spec=Project)

    project.id = uuid4()
    project.name = create_request.name
    project.key = create_request.key
    project.description = create_request.description
    project.organization_id = create_request.organization_id
    project.owner_id = create_request.owner_id
    project.is_active = True

    return project


def test_create_project_success(
    service: ProjectService,
    project_repository: MagicMock,
    create_request: ProjectCreateRequest,
    project: Project,
) -> None:
    """Create project successfully."""
    project_repository.exists_by_name.return_value = False
    project_repository.exists_by_key.return_value = False
    project_repository.create.return_value = project

    result = service.create_project(create_request)

    assert result is project

    project_repository.exists_by_name.assert_called_once_with(
        create_request.name,
    )
    project_repository.exists_by_key.assert_called_once_with(
        create_request.key,
    )
    project_repository.create.assert_called_once()


def test_create_project_duplicate_name(
    service: ProjectService,
    project_repository: MagicMock,
    create_request: ProjectCreateRequest,
) -> None:
    """Raise if project name already exists."""
    project_repository.exists_by_name.return_value = True

    with pytest.raises(ProjectNameAlreadyExistsError):
        service.create_project(create_request)

    project_repository.create.assert_not_called()


def test_create_project_duplicate_key(
    service: ProjectService,
    project_repository: MagicMock,
    create_request: ProjectCreateRequest,
) -> None:
    """Raise if project key already exists."""
    project_repository.exists_by_name.return_value = False
    project_repository.exists_by_key.return_value = True

    with pytest.raises(ProjectKeyAlreadyExistsError):
        service.create_project(create_request)

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
        owner_id=uuid4(),
        is_active=False,
    )

    project_repository.get.return_value = project
    project_repository.update.return_value = project

    result = service.update_project(
        project.id,
        request,
    )

    assert result is project
    assert project.name == request.name
    assert project.description == request.description
    assert project.owner_id == request.owner_id
    assert project.is_active is request.is_active

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

    project_repository.count.assert_called_once_with()
