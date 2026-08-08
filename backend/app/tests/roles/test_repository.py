"""Tests for the role repository."""

from __future__ import annotations

from collections.abc import Callable
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.role import Role
from app.roles.repository import RoleRepository
from app.roles.schemas import RoleListQuery

RoleFactory = Callable[..., Role]


def test_get_by_id(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should return a role by identifier."""
    role = role_factory()
    repository = RoleRepository(db_session)

    result = repository.get_by_id(role.id)

    assert result is not None
    assert result.id == role.id
    assert result.name == "Support Agent"


def test_get_by_id_returns_none_for_missing_role(
    db_session: Session,
) -> None:
    """Repository should return None for an unknown identifier."""
    repository = RoleRepository(db_session)

    result = repository.get_by_id(uuid4())

    assert result is None


def test_get_by_name(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should find a role by name."""
    role = role_factory(
        name="Support Manager",
    )
    repository = RoleRepository(db_session)

    result = repository.get_by_name("Support Manager")

    assert result is not None
    assert result.id == role.id
    assert result.name == "Support Manager"


def test_get_by_name_returns_none_when_missing(
    db_session: Session,
) -> None:
    """Repository should return None when the name is missing."""
    repository = RoleRepository(db_session)

    result = repository.get_by_name("Unknown Role")

    assert result is None


def test_list_returns_roles(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should return paginated roles."""
    role_factory(name="Agent")
    role_factory(name="Manager")

    repository = RoleRepository(db_session)

    query = RoleListQuery(
        page=1,
        page_size=20,
    )

    items, total, total_pages = repository.list(query)

    assert len(items) == 2
    assert total == 2
    assert total_pages == 1


def test_list_supports_search(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should search role names."""
    role_factory(name="Support Agent")
    role_factory(name="Support Manager")
    role_factory(name="Customer Viewer")

    repository = RoleRepository(db_session)

    query = RoleListQuery(
        page=1,
        page_size=20,
        search="Support",
    )

    items, total, total_pages = repository.list(query)

    assert len(items) == 2
    assert total == 2
    assert total_pages == 1

    assert all(
        "Support" in item.name
        for item in items
    )


def test_list_supports_system_filter(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should filter system roles."""
    role_factory(
        name="System Admin",
        is_system=True,
    )
    role_factory(
        name="Support Agent",
        is_system=False,
    )

    repository = RoleRepository(db_session)

    query = RoleListQuery(
        page=1,
        page_size=20,
        is_system=True,
    )

    items, total, total_pages = repository.list(query)

    assert len(items) == 1
    assert total == 1
    assert total_pages == 1
    assert items[0].is_system is True


def test_list_supports_custom_role_filter(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should filter custom roles."""
    role_factory(
        name="System Admin",
        is_system=True,
    )
    role_factory(
        name="Support Agent",
        is_system=False,
    )

    repository = RoleRepository(db_session)

    query = RoleListQuery(
        page=1,
        page_size=20,
        is_system=False,
    )

    items, total, total_pages = repository.list(query)

    assert len(items) == 1
    assert total == 1
    assert total_pages == 1
    assert items[0].is_system is False


def test_list_supports_pagination(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should apply page and page size."""
    for index in range(5):
        role_factory(
            name=f"Role {index}",
        )

    repository = RoleRepository(db_session)

    query = RoleListQuery(
        page=2,
        page_size=2,
    )

    items, total, total_pages = repository.list(query)

    assert len(items) == 2
    assert total == 5
    assert total_pages == 3


def test_list_returns_empty_result_when_no_roles(
    db_session: Session,
) -> None:
    """Repository should return an empty paginated result."""
    repository = RoleRepository(db_session)

    query = RoleListQuery(
        page=1,
        page_size=20,
    )

    items, total, total_pages = repository.list(query)

    assert items == []
    assert total == 0
    assert total_pages == 0


def test_count(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should return total role count."""
    role_factory(name="Agent")
    role_factory(name="Manager")

    repository = RoleRepository(db_session)

    assert repository.count() == 2


def test_count_system(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should count system roles."""
    role_factory(
        name="System Admin",
        is_system=True,
    )
    role_factory(
        name="Support Agent",
        is_system=False,
    )
    role_factory(
        name="Support Manager",
        is_system=False,
    )

    repository = RoleRepository(db_session)

    assert repository.count_system() == 1


def test_count_assigned_returns_zero_for_unassigned_roles(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should return zero when no roles are assigned."""
    role_factory(name="Support Agent")
    role_factory(name="Support Manager")

    repository = RoleRepository(db_session)

    assert repository.count_assigned() == 0


def test_create(
    db_session: Session,
    organization: Organization,
) -> None:
    """Repository should persist a new role."""
    repository = RoleRepository(db_session)

    role = Role(
        organization_id=organization.id,
        name="Support Agent",
        description="Handles customer support.",
        is_system=False,
    )

    result = repository.create(role)
    db_session.commit()

    assert result.id is not None
    assert result.name == "Support Agent"
    assert result.organization_id == organization.id

    stored = repository.get_by_id(result.id)

    assert stored is not None
    assert stored.name == "Support Agent"
    assert stored.description == "Handles customer support."
    assert stored.organization_id == organization.id


def test_update(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should persist role changes."""
    role = role_factory()

    repository = RoleRepository(db_session)

    role.name = "Senior Support Agent"
    role.description = "Updated description."

    result = repository.update(role)
    db_session.commit()

    assert result.name == "Senior Support Agent"
    assert result.description == "Updated description."

    stored = repository.get_by_id(role.id)

    assert stored is not None
    assert stored.name == "Senior Support Agent"
    assert stored.description == "Updated description."


def test_delete(
    db_session: Session,
    role_factory: RoleFactory,
) -> None:
    """Repository should delete a role."""
    role = role_factory()

    repository = RoleRepository(db_session)

    repository.delete(role)
    db_session.commit()

    result = repository.get_by_id(role.id)

    assert result is None