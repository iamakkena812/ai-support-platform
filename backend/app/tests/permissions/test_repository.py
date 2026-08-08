"""Tests for permission repository."""

from __future__ import annotations

from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.permissions.repository import PermissionRepository
from app.permissions.schemas import PermissionListQuery


def create_permission(
    db_session: Session,
    *,
    name: str = "Create User",
    resource: str = "user",
    action: str = "create",
    description: str | None = "Create users.",
) -> Permission:
    """Create a permission test record.

    Args:
        db_session: Database session.
        name: Permission name.
        resource: Permission resource.
        action: Permission action.
        description: Permission description.

    Returns:
        Persisted permission.
    """
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


def test_get_by_id(
    db_session: Session,
) -> None:
    """Repository should return a permission by identifier."""
    permission = create_permission(db_session)
    repository = PermissionRepository(db_session)

    result = repository.get_by_id(permission.id)

    assert result is not None
    assert result.id == permission.id
    assert result.name == "Create User"


def test_get_by_id_returns_none_for_missing_permission(
    db_session: Session,
) -> None:
    """Repository should return None for an unknown identifier."""
    repository = PermissionRepository(db_session)

    result = repository.get_by_id(uuid4())

    assert result is None


def test_get_by_resource_action(
    db_session: Session,
) -> None:
    """Repository should find a permission by resource and action."""
    permission = create_permission(
        db_session,
        resource="ticket",
        action="read",
        name="Read Tickets",
    )

    repository = PermissionRepository(db_session)

    result = repository.get_by_resource_action(
        "ticket",
        "read",
    )

    assert result is not None
    assert result.id == permission.id


def test_get_by_resource_action_returns_none_when_missing(
    db_session: Session,
) -> None:
    """Repository should return None when resource/action is missing."""
    repository = PermissionRepository(db_session)

    result = repository.get_by_resource_action(
        "unknown",
        "read",
    )

    assert result is None


def test_list_returns_permissions(
    db_session: Session,
) -> None:
    """Repository should return paginated permissions."""
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

    repository = PermissionRepository(db_session)

    query = PermissionListQuery(
        page=1,
        page_size=20,
    )

    items, total, total_pages = repository.list(query)

    assert len(items) == 2
    assert total == 2
    assert total_pages == 1


def test_list_supports_search(
    db_session: Session,
) -> None:
    """Repository should search name, resource, action, and description."""
    create_permission(
        db_session,
        name="Create Customer",
        resource="customer",
        action="create",
        description="Create customer records.",
    )
    create_permission(
        db_session,
        name="Read Tickets",
        resource="ticket",
        action="read",
        description="Read ticket records.",
    )

    repository = PermissionRepository(db_session)

    query = PermissionListQuery(
        page=1,
        page_size=20,
        search="customer",
    )

    items, total, total_pages = repository.list(query)

    assert len(items) == 1
    assert total == 1
    assert total_pages == 1
    assert items[0].resource == "customer"


def test_list_supports_resource_filter(
    db_session: Session,
) -> None:
    """Repository should filter permissions by resource."""
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

    repository = PermissionRepository(db_session)

    query = PermissionListQuery(
        page=1,
        page_size=20,
        resource="user",
    )

    items, total, total_pages = repository.list(query)

    assert len(items) == 2
    assert total == 2
    assert total_pages == 1

    assert all(
        item.resource == "user"
        for item in items
    )


def test_list_supports_action_filter(
    db_session: Session,
) -> None:
    """Repository should filter permissions by action."""
    create_permission(
        db_session,
        name="Create User",
        resource="user",
        action="create",
    )
    create_permission(
        db_session,
        name="Create Ticket",
        resource="ticket",
        action="create",
    )
    create_permission(
        db_session,
        name="Read User",
        resource="user",
        action="read",
    )

    repository = PermissionRepository(db_session)

    query = PermissionListQuery(
        page=1,
        page_size=20,
        action="create",
    )

    items, total, total_pages = repository.list(query)

    assert len(items) == 2
    assert total == 2
    assert total_pages == 1

    assert all(
        item.action == "create"
        for item in items
    )


def test_list_supports_pagination(
    db_session: Session,
) -> None:
    """Repository should apply page and page size."""
    for index in range(5):
        create_permission(
            db_session,
            name=f"Permission {index}",
            resource=f"resource-{index}",
            action="read",
        )

    repository = PermissionRepository(db_session)

    query = PermissionListQuery(
        page=2,
        page_size=2,
    )

    items, total, total_pages = repository.list(query)

    assert len(items) == 2
    assert total == 5
    assert total_pages == 3


def test_list_returns_empty_result_when_no_permissions(
    db_session: Session,
) -> None:
    """Repository should return an empty paginated result."""
    repository = PermissionRepository(db_session)

    query = PermissionListQuery(
        page=1,
        page_size=20,
    )

    items, total, total_pages = repository.list(query)

    assert items == []
    assert total == 0
    assert total_pages == 0


def test_count(
    db_session: Session,
) -> None:
    """Repository should return total permission count."""
    create_permission(
        db_session,
        resource="user",
        action="create",
    )
    create_permission(
        db_session,
        resource="user",
        action="read",
        name="Read User",
    )

    repository = PermissionRepository(db_session)

    assert repository.count() == 2


def test_count_resources(
    db_session: Session,
) -> None:
    """Repository should count distinct permission resources."""
    create_permission(
        db_session,
        resource="user",
        action="create",
    )
    create_permission(
        db_session,
        resource="user",
        action="read",
        name="Read User",
    )
    create_permission(
        db_session,
        resource="ticket",
        action="read",
        name="Read Ticket",
    )

    repository = PermissionRepository(db_session)

    assert repository.count_resources() == 2


def test_create(
    db_session: Session,
) -> None:
    """Repository should persist a new permission."""
    repository = PermissionRepository(db_session)

    permission = Permission(
        name="Delete User",
        resource="user",
        action="delete",
        description="Delete users.",
    )

    result = repository.create(permission)
    db_session.commit()

    assert result.id is not None
    assert result.name == "Delete User"

    stored = repository.get_by_id(result.id)

    assert stored is not None
    assert stored.resource == "user"
    assert stored.action == "delete"


def test_update(
    db_session: Session,
) -> None:
    """Repository should persist permission changes."""
    permission = create_permission(db_session)

    repository = PermissionRepository(db_session)

    permission.name = "Create Users"
    permission.description = "Updated description."

    result = repository.update(permission)
    db_session.commit()

    assert result.name == "Create Users"
    assert result.description == "Updated description."

    stored = repository.get_by_id(permission.id)

    assert stored is not None
    assert stored.name == "Create Users"
    assert stored.description == "Updated description."


def test_delete(
    db_session: Session,
) -> None:
    """Repository should delete a permission."""
    permission = create_permission(db_session)

    repository = PermissionRepository(db_session)

    repository.delete(permission)
    db_session.commit()

    result = repository.get_by_id(permission.id)

    assert result is None