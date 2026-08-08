"""Tests for permission management service."""

from __future__ import annotations

from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.permissions.exceptions import (
    PermissionAlreadyExistsError,
    PermissionInUseError,
    PermissionNotFoundError,
)
from app.permissions.repository import PermissionRepository
from app.permissions.schemas import (
    PermissionCreate,
    PermissionListQuery,
    PermissionUpdate,
)
from app.permissions.service import PermissionService


def create_permission(
    db_session: Session,
    *,
    name: str = "Create User",
    resource: str = "user",
    action: str = "create",
    description: str | None = "Create users.",
) -> Permission:
    """Create a permission test record."""
    permission = Permission(
        name=name,
        resource=resource,
        action=action,
        description=description,
    )

    db_session.add(permission)
    db_session.commit()
    db_session.refresh(permission)

    return permission


def test_get_by_id_success(
    db_session: Session,
) -> None:
    """Service should return an existing permission."""
    permission = create_permission(db_session)
    service = PermissionService(db_session)

    result = service.get_by_id(permission.id)

    assert result.id == permission.id
    assert result.name == "Create User"
    assert result.resource == "user"
    assert result.action == "create"


def test_get_by_id_not_found(
    db_session: Session,
) -> None:
    """Service should raise when permission does not exist."""
    service = PermissionService(db_session)

    with pytest.raises(PermissionNotFoundError):
        service.get_by_id(uuid4())


def test_list_success(
    db_session: Session,
) -> None:
    """Service should return paginated permissions."""
    create_permission(
        db_session,
        name="Create User",
        resource="user",
        action="create",
    )
    create_permission(
        db_session,
        name="Read User",
        resource="user",
        action="read",
    )

    service = PermissionService(db_session)

    query = PermissionListQuery(
        page=1,
        page_size=20,
    )

    result = service.list(query)

    assert len(result.items) == 2
    assert result.total == 2
    assert result.page == 1
    assert result.page_size == 20
    assert result.total_pages == 1


def test_list_with_filters(
    db_session: Session,
) -> None:
    """Service should pass permission filters to the repository."""
    create_permission(
        db_session,
        name="Create Customer",
        resource="customer",
        action="create",
    )
    create_permission(
        db_session,
        name="Read Ticket",
        resource="ticket",
        action="read",
    )

    service = PermissionService(db_session)

    query = PermissionListQuery(
        page=1,
        page_size=20,
        resource="customer",
    )

    result = service.list(query)

    assert len(result.items) == 1
    assert result.total == 1
    assert result.items[0].resource == "customer"


def test_create_success(
    db_session: Session,
) -> None:
    """Service should create a permission."""
    service = PermissionService(db_session)

    request = PermissionCreate(
        name="Create Ticket",
        resource="ticket",
        action="create",
        description="Create tickets.",
    )

    result = service.create(request)

    assert result.id is not None
    assert result.name == "Create Ticket"
    assert result.resource == "ticket"
    assert result.action == "create"
    assert result.description == "Create tickets."


def test_create_duplicate_resource_action(
    db_session: Session,
) -> None:
    """Service should reject duplicate resource/action combinations."""
    create_permission(
        db_session,
        name="Create User",
        resource="user",
        action="create",
    )

    service = PermissionService(db_session)

    request = PermissionCreate(
        name="Create Users Again",
        resource="user",
        action="create",
    )

    with pytest.raises(PermissionAlreadyExistsError):
        service.create(request)


def test_create_handles_integrity_error(
    db_session: Session,
) -> None:
    """Service should translate repository integrity errors."""
    repository = MagicMock(spec=PermissionRepository)

    repository.get_by_resource_action.return_value = None
    repository.create.side_effect = IntegrityError(
        "duplicate",
        {},
        Exception("duplicate"),
    )

    service = PermissionService(
        db_session,
        repository=repository,
    )

    request = PermissionCreate(
        name="Create User",
        resource="user",
        action="create",
    )

    with pytest.raises(PermissionAlreadyExistsError):
        service.create(request)

    repository.create.assert_called_once()
    repository.get_by_resource_action.assert_called_once_with(
        "user",
        "create",
    )


def test_update_success(
    db_session: Session,
) -> None:
    """Service should update an existing permission."""
    permission = create_permission(db_session)
    service = PermissionService(db_session)

    request = PermissionUpdate(
        name="Create Users",
        description="Updated description.",
    )

    result = service.update(
        permission.id,
        request,
    )

    assert result.id == permission.id
    assert result.name == "Create Users"
    assert result.description == "Updated description."


def test_update_not_found(
    db_session: Session,
) -> None:
    """Service should raise when updating a missing permission."""
    service = PermissionService(db_session)

    request = PermissionUpdate(
        name="Updated Permission",
    )

    with pytest.raises(PermissionNotFoundError):
        service.update(
            uuid4(),
            request,
        )


def test_update_duplicate_resource_action(
    db_session: Session,
) -> None:
    """Service should reject conflicting resource/action updates."""
    first = create_permission(
        db_session,
        name="Create User",
        resource="user",
        action="create",
    )

    second = create_permission(
        db_session,
        name="Read Ticket",
        resource="ticket",
        action="read",
    )

    service = PermissionService(db_session)

    request = PermissionUpdate(
        resource=first.resource,
        action=first.action,
    )

    with pytest.raises(PermissionAlreadyExistsError):
        service.update(
            second.id,
            request,
        )


def test_update_same_resource_action_is_allowed(
    db_session: Session,
) -> None:
    """Service should allow updating other fields without a conflict."""
    permission = create_permission(
        db_session,
        name="Create User",
        resource="user",
        action="create",
    )

    service = PermissionService(db_session)

    request = PermissionUpdate(
        name="Create Users",
        resource="user",
        action="create",
    )

    result = service.update(
        permission.id,
        request,
    )

    assert result.id == permission.id
    assert result.name == "Create Users"


def test_update_handles_integrity_error(
    db_session: Session,
) -> None:
    """Service should translate update integrity errors."""
    permission_id = uuid4()

    permission = Permission(
        id=permission_id,
        name="Create User",
        resource="user",
        action="create",
    )

    repository = MagicMock(spec=PermissionRepository)

    repository.get_by_id.return_value = permission
    repository.get_by_resource_action.return_value = None
    repository.update.side_effect = IntegrityError(
        "duplicate",
        {},
        Exception("duplicate"),
    )

    service = PermissionService(
        db_session,
        repository=repository,
    )

    request = PermissionUpdate(
        name="Updated User Permission",
    )

    with pytest.raises(PermissionAlreadyExistsError):
        service.update(
            permission_id,
            request,
        )


def test_delete_success(
    db_session: Session,
) -> None:
    """Service should delete an unused permission."""
    permission = create_permission(db_session)
    service = PermissionService(db_session)

    service.delete(permission.id)

    assert service.repository.get_by_id(permission.id) is None


def test_delete_not_found(
    db_session: Session,
) -> None:
    """Service should raise when deleting a missing permission."""
    service = PermissionService(db_session)

    with pytest.raises(PermissionNotFoundError):
        service.delete(uuid4())


def test_delete_permission_in_use(
    db_session: Session,
) -> None:
    """Service should reject deletion of assigned permissions."""
    permission = MagicMock(spec=Permission)
    permission.id = uuid4()
    permission.role_permissions = [MagicMock()]

    repository = MagicMock(spec=PermissionRepository)
    repository.get_by_id.return_value = permission

    service = PermissionService(
        db_session,
        repository=repository,
    )

    with pytest.raises(PermissionInUseError):
        service.delete(permission.id)

    repository.delete.assert_not_called()


def test_delete_handles_integrity_error(
    db_session: Session,
) -> None:
    """Service should translate delete integrity errors."""
    permission = create_permission(db_session)

    repository = MagicMock(spec=PermissionRepository)
    repository.get_by_id.return_value = permission
    repository.delete.side_effect = IntegrityError(
        "foreign key",
        {},
        Exception("permission is in use"),
    )

    service = PermissionService(
        db_session,
        repository=repository,
    )

    with pytest.raises(PermissionInUseError):
        service.delete(permission.id)


def test_statistics_empty(
    db_session: Session,
) -> None:
    """Service should return zero statistics when empty."""
    service = PermissionService(db_session)

    result = service.statistics()

    assert result.total == 0
    assert result.resources == 0
    assert result.assigned == 0
    assert result.unassigned == 0


def test_statistics(
    db_session: Session,
) -> None:
    """Service should calculate permission statistics."""
    create_permission(
        db_session,
        name="Create User",
        resource="user",
        action="create",
    )
    create_permission(
        db_session,
        name="Read User",
        resource="user",
        action="read",
    )
    create_permission(
        db_session,
        name="Read Ticket",
        resource="ticket",
        action="read",
    )

    service = PermissionService(db_session)

    result = service.statistics()

    assert result.total == 3
    assert result.resources == 2
    assert result.assigned == 0
    assert result.unassigned == 3