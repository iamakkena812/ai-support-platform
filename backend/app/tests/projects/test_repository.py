"""Tests for ProjectRepository."""

from __future__ import annotations

from uuid import uuid4

from app.models.organization import Organization
from app.models.project import Project
from app.models.user import User
from app.repositories.project import ProjectRepository


def create_project(
    organization: Organization,
    user: User,
    *,
    name: str | None = None,
    key: str | None = None,
) -> Project:
    """Create a project instance."""
    suffix = uuid4().hex[:8]

    return Project(
        name=name or f"Test Project {suffix}",
        key=key or f"T{suffix[:6].upper()}",
        description="Test description",
        organization_id=organization.id,
        owner_id=user.id,
        is_active=True,
    )


def test_create(
    project_repository: ProjectRepository,
    organization: Organization,
    user: User,
) -> None:
    """Test creating a project."""
    project = create_project(organization, user)

    created = project_repository.create(project)

    assert created.id == project.id
    assert created.name == project.name


def test_get(
    project_repository: ProjectRepository,
    organization: Organization,
    user: User,
) -> None:
    """Test retrieving a project by ID."""
    project = project_repository.create(
        create_project(organization, user),
    )

    found = project_repository.get(project.id)

    assert found is not None
    assert found.id == project.id


def test_get_not_found(
    project_repository: ProjectRepository,
) -> None:
    """Test retrieving a non-existent project."""
    assert project_repository.get(uuid4()) is None


def test_get_by_name(
    project_repository: ProjectRepository,
    organization: Organization,
    user: User,
) -> None:
    """Test retrieving a project by name."""
    project = project_repository.create(
        create_project(
            organization,
            user,
            name="Backend",
        ),
    )

    found = project_repository.get_by_name("Backend")

    assert found is not None
    assert found.id == project.id
    assert found.name == "Backend"


def test_get_by_key(
    project_repository: ProjectRepository,
    organization: Organization,
    user: User,
) -> None:
    """Test retrieving a project by key."""
    project = project_repository.create(
        create_project(
            organization,
            user,
            key="API",
        ),
    )

    found = project_repository.get_by_key("API")

    assert found is not None
    assert found.id == project.id
    assert found.key == "API"


def test_exists_by_name(
    project_repository: ProjectRepository,
    organization: Organization,
    user: User,
) -> None:
    """Test exists_by_name."""
    project_repository.create(
        create_project(
            organization,
            user,
            name="Platform",
        ),
    )

    assert project_repository.exists_by_name("Platform") is True
    assert project_repository.exists_by_name("Missing") is False


def test_exists_by_key(
    project_repository: ProjectRepository,
    organization: Organization,
    user: User,
) -> None:
    """Test exists_by_key."""
    project_repository.create(
        create_project(
            organization,
            user,
            key="SUPPORT",
        ),
    )

    assert project_repository.exists_by_key("SUPPORT") is True
    assert project_repository.exists_by_key("UNKNOWN") is False


def test_list(
    project_repository: ProjectRepository,
    organization: Organization,
    user: User,
) -> None:
    """Test listing projects."""
    project_repository.create(
        create_project(
            organization,
            user,
            name="One",
            key="ONE",
        ),
    )

    project_repository.create(
        create_project(
            organization,
            user,
            name="Two",
            key="TWO",
        ),
    )

    projects = project_repository.list()

    assert len(projects) >= 2


def test_update(
    project_repository: ProjectRepository,
    organization: Organization,
    user: User,
) -> None:
    """Test updating a project."""
    project = project_repository.create(
        create_project(
            organization,
            user,
        ),
    )

    project.name = "Updated Project"

    updated = project_repository.update(project)

    assert updated.name == "Updated Project"


def test_delete(
    project_repository: ProjectRepository,
    organization: Organization,
    user: User,
) -> None:
    """Test deleting a project."""
    project = project_repository.create(
        create_project(
            organization,
            user,
        ),
    )

    project_repository.delete(project)

    assert project_repository.get(project.id) is None


def test_count(
    project_repository: ProjectRepository,
    organization: Organization,
    user: User,
) -> None:
    """Test counting projects."""
    initial = project_repository.count()

    project_repository.create(
        create_project(
            organization,
            user,
        ),
    )

    assert project_repository.count() == initial + 1
