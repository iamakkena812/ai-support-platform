"""Permission API router."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.permissions.dependencies import PermissionServiceDependency
from app.permissions.exceptions import (
    PermissionAlreadyExistsError,
    PermissionInUseError,
    PermissionNotFoundError,
)
from app.permissions.schemas import (
    PermissionCreate,
    PermissionListQuery,
    PermissionListResponse,
    PermissionResponse,
    PermissionStatistics,
    PermissionUpdate,
)

router = APIRouter(
    prefix="/permissions",
    tags=["Permissions"],
)


@router.get(
    "",
    response_model=PermissionListResponse,
)
def list_permissions(
    service: PermissionServiceDependency,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    resource: str | None = Query(default=None),
    action: str | None = Query(default=None),
) -> PermissionListResponse:
    """Return a paginated list of permissions."""
    query = PermissionListQuery(
        page=page,
        page_size=page_size,
        search=search,
        resource=resource,
        action=action,
    )

    return service.list(query)


@router.get(
    "/statistics",
    response_model=PermissionStatistics,
)
def get_permission_statistics(
    service: PermissionServiceDependency,
) -> PermissionStatistics:
    """Return permission statistics."""
    return service.statistics()


@router.get(
    "/{permission_id}",
    response_model=PermissionResponse,
)
def get_permission(
    permission_id: UUID,
    service: PermissionServiceDependency,
) -> PermissionResponse:
    """Return a permission by identifier."""
    try:
        return service.get_by_id(permission_id)
    except PermissionNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.post(
    "",
    response_model=PermissionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_permission(
    request: PermissionCreate,
    service: PermissionServiceDependency,
) -> PermissionResponse:
    """Create a permission."""
    try:
        return service.create(request)
    except PermissionAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


@router.patch(
    "/{permission_id}",
    response_model=PermissionResponse,
)
def update_permission(
    permission_id: UUID,
    request: PermissionUpdate,
    service: PermissionServiceDependency,
) -> PermissionResponse:
    """Update a permission."""
    try:
        return service.update(
            permission_id,
            request,
        )
    except PermissionNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except PermissionAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


@router.delete(
    "/{permission_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_permission(
    permission_id: UUID,
    service: PermissionServiceDependency,
) -> None:
    """Delete a permission."""
    try:
        service.delete(permission_id)
    except PermissionNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except PermissionInUseError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


__all__ = ["router"]