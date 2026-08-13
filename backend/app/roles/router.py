"""Role API router."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.models.user import User
from app.rbac.dependencies import require_permission
from app.roles.dependencies import RoleServiceDependency
from app.roles.exceptions import (
    RoleAlreadyExistsError,
    RoleInUseError,
    RoleNotFoundError,
)
from app.roles.schemas import (
    RoleCreate,
    RoleListQuery,
    RoleListResponse,
    RoleResponse,
    RoleStatistics,
    RoleUpdate,
)

router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
)


CreateRolePermission = Annotated[
    User,
    Depends(require_permission("role", "create")),
]

ReadRolePermission = Annotated[
    User,
    Depends(require_permission("role", "read")),
]

UpdateRolePermission = Annotated[
    User,
    Depends(require_permission("role", "update")),
]

DeleteRolePermission = Annotated[
    User,
    Depends(require_permission("role", "delete")),
]


@router.get(
    "",
    response_model=RoleListResponse,
)
def list_roles(
    _: ReadRolePermission,
    service: RoleServiceDependency,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100, alias="pageSize"),
    search: str | None = Query(default=None),
    is_system: bool | None = Query(default=None, alias="isSystem"),
) -> RoleListResponse:
    """Return a paginated list of roles."""
    query = RoleListQuery(
        page=page,
        page_size=page_size,
        search=search,
        is_system=is_system,
    )

    return service.list(query)


@router.get(
    "/statistics",
    response_model=RoleStatistics,
)
def get_role_statistics(
    _: ReadRolePermission,
    service: RoleServiceDependency,
) -> RoleStatistics:
    """Return role statistics."""
    return service.statistics()


@router.get(
    "/{role_id}",
    response_model=RoleResponse,
)
def get_role(
    role_id: UUID,
    _: ReadRolePermission,
    service: RoleServiceDependency,
) -> RoleResponse:
    """Return a role by identifier."""
    try:
        return service.get_by_id(role_id)
    except RoleNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.post(
    "",
    response_model=RoleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_role(
    request: RoleCreate,
    _: CreateRolePermission,
    service: RoleServiceDependency,
) -> RoleResponse:
    """Create a role."""
    try:
        return service.create(request)
    except RoleAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


@router.patch(
    "/{role_id}",
    response_model=RoleResponse,
)
def update_role(
    role_id: UUID,
    request: RoleUpdate,
    _: UpdateRolePermission,
    service: RoleServiceDependency,
) -> RoleResponse:
    """Update a role."""
    try:
        return service.update(role_id, request)
    except RoleNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except RoleAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc
    except RoleInUseError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


@router.delete(
    "/{role_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_role(
    role_id: UUID,
    _: DeleteRolePermission,
    service: RoleServiceDependency,
) -> None:
    """Delete a role."""
    try:
        service.delete(role_id)
    except RoleNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except RoleInUseError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


__all__ = ["router"]