"""Role API router."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

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


@router.get(
    "",
    response_model=RoleListResponse,
)
def list_roles(
    service: RoleServiceDependency,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    is_system: bool | None = Query(default=None),
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