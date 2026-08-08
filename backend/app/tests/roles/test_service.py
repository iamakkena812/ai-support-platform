"""Tests for the role service."""

from __future__ import annotations

from collections.abc import Callable
from uuid import uuid4

import pytest
from pytest import MonkeyPatch
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.role import Role
from app.roles.exceptions import (
    RoleAlreadyExistsError,
    RoleInUseError,
    RoleNotFoundError,
)
from app.roles.schemas import (
    RoleCreate,
    RoleListQuery,
    RoleUpdate,
)
from app.roles.service import RoleService

RoleFactory = Callable[..., Role]


def test_get_by_id_success(
    db_session: Session,
    organization: Organization,
    role_factory: RoleFactory,
) -> None:
    """Service should return an existing role."""
    role = role_factory()

    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    result = service.get_by_id(role.id)

    assert result.id == role.id
    assert result.name == role.name


def test_get_by_id_not_found(
    db_session: Session,
    organization: Organization,
) -> None:
    """Service should raise when the role does not exist."""
    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    with pytest.raises(RoleNotFoundError):
        service.get_by_id(uuid4())


def test_list_roles(
    db_session: Session,
    organization: Organization,
    role_factory: RoleFactory,
) -> None:
    """Service should return paginated roles."""
    role_factory(name="Agent")
    role_factory(name="Manager")

    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    result = service.list(
        RoleListQuery(
            page=1,
            page_size=20,
        ),
    )

    assert result.total == 2
    assert result.page == 1
    assert result.page_size == 20
    assert result.total_pages == 1
    assert len(result.items) == 2


def test_create_role_success(
    db_session: Session,
    organization: Organization,
) -> None:
    """Service should create a role."""
    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    result = service.create(
        RoleCreate(
            name="New Support Agent",
            description="Handles customer support.",
        ),
    )

    assert result.id is not None
    assert result.name == "New Support Agent"
    assert result.description == "Handles customer support."
    assert result.is_system is False


def test_create_role_duplicate(
    db_session: Session,
    organization: Organization,
    role_factory: RoleFactory,
) -> None:
    """Service should reject duplicate role names."""
    role_factory(name="Support Agent")

    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    with pytest.raises(RoleAlreadyExistsError):
        service.create(
            RoleCreate(
                name="Support Agent",
            ),
        )


def test_update_role_success(
    db_session: Session,
    organization: Organization,
    role_factory: RoleFactory,
) -> None:
    """Service should update a role."""
    role = role_factory()

    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    result = service.update(
        role.id,
        RoleUpdate(
            name="Senior Support Agent",
            description="Updated description.",
        ),
    )

    assert result.id == role.id
    assert result.name == "Senior Support Agent"
    assert result.description == "Updated description."


def test_update_role_not_found(
    db_session: Session,
    organization: Organization,
) -> None:
    """Service should raise when updating a missing role."""
    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    with pytest.raises(RoleNotFoundError):
        service.update(
            uuid4(),
            RoleUpdate(
                name="Updated Role",
            ),
        )


def test_update_role_duplicate(
    db_session: Session,
    organization: Organization,
    role_factory: RoleFactory,
) -> None:
    """Service should reject duplicate names during update."""
    first = role_factory(
        name="Support Agent",
    )
    second = role_factory(
        name="Support Manager",
    )

    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    with pytest.raises(RoleAlreadyExistsError):
        service.update(
            second.id,
            RoleUpdate(
                name=first.name,
            ),
        )


def test_update_system_role_rejected(
    db_session: Session,
    organization: Organization,
    role_factory: RoleFactory,
) -> None:
    """Service should reject updates to system roles."""
    role = role_factory(
        name="System Admin",
        is_system=True,
    )

    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    with pytest.raises(RoleInUseError):
        service.update(
            role.id,
            RoleUpdate(
                name="Updated Admin",
            ),
        )


def test_delete_role_success(
    db_session: Session,
    organization: Organization,
    role_factory: RoleFactory,
) -> None:
    """Service should delete an unused role."""
    role = role_factory()

    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    service.delete(role.id)

    assert service.repository.get_by_id(role.id) is None


def test_delete_role_not_found(
    db_session: Session,
    organization: Organization,
) -> None:
    """Service should raise when deleting a missing role."""
    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    with pytest.raises(RoleNotFoundError):
        service.delete(uuid4())


def test_delete_system_role_rejected(
    db_session: Session,
    organization: Organization,
    role_factory: RoleFactory,
) -> None:
    """Service should reject deletion of system roles."""
    role = role_factory(
        name="System Admin",
        is_system=True,
    )

    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    with pytest.raises(RoleInUseError):
        service.delete(role.id)


def test_delete_role_in_use(
    db_session: Session,
    organization: Organization,
    role_factory: RoleFactory,
    monkeypatch: MonkeyPatch,
) -> None:
    """Service should reject deletion of an assigned role."""
    role = role_factory()

    class AssignedRole:
        """Represent a role with an assigned user."""

        is_system = False
        user_roles: list[object] = [object()]
        role_permissions: list[object] = []

    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    monkeypatch.setattr(
        service.repository,
        "get_by_id",
        lambda role_id: AssignedRole(),
    )

    with pytest.raises(RoleInUseError):
        service.delete(role.id)


def test_statistics(
    db_session: Session,
    organization: Organization,
    role_factory: RoleFactory,
) -> None:
    """Service should return role statistics."""
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

    service = RoleService(
        db_session,
        organization_id=organization.id,
    )

    result = service.statistics()

    assert result.total == 3
    assert result.system == 1
    assert result.custom == 2
    assert result.assigned == 0
    assert result.unassigned == 3