"""User API router."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Response, status

from app.models.user import User
from app.rbac.dependencies import require_permission
from app.users.dependencies import UserServiceDependency
from app.users.schemas import (
    CreateUserRequest,
    UpdateUserRequest,
    UserListResponse,
    UserResponse,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


CreateUserPermission = Annotated[
    User,
    Depends(require_permission("user", "create")),
]

ViewUserPermission = Annotated[
    User,
    Depends(require_permission("user", "view")),
]

UpdateUserPermission = Annotated[
    User,
    Depends(require_permission("user", "update")),
]

DeleteUserPermission = Annotated[
    User,
    Depends(require_permission("user", "delete")),
]


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create user",
)
async def create_user(
    request: CreateUserRequest,
    _: CreateUserPermission,
    service: UserServiceDependency,
) -> UserResponse:
    """Create a new user."""
    user = service.create_user(request)
    return UserResponse.model_validate(user)


@router.get(
    "",
    response_model=UserListResponse,
    summary="List users",
)
async def list_users(
    _: ViewUserPermission,
    service: UserServiceDependency,
    offset: int = 0,
    limit: int = 100,
) -> UserListResponse:
    """Return all users."""
    users = service.list_users(
        offset=offset,
        limit=limit,
    )

    return UserListResponse(
        users=[UserResponse.model_validate(user) for user in users],
        total=len(users),
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get user",
)
async def get_user(
    user_id: UUID,
    _: ViewUserPermission,
    service: UserServiceDependency,
) -> UserResponse:
    """Return a user by ID."""
    user = service.get_user(user_id)
    return UserResponse.model_validate(user)


@router.patch(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update user",
)
async def update_user(
    user_id: UUID,
    request: UpdateUserRequest,
    _: UpdateUserPermission,
    service: UserServiceDependency,
) -> UserResponse:
    """Update an existing user."""
    user = service.update_user(
        user_id=user_id,
        request=request,
    )

    return UserResponse.model_validate(user)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user",
)
async def delete_user(
    user_id: UUID,
    _: DeleteUserPermission,
    service: UserServiceDependency,
) -> Response:
    """Delete a user."""
    service.delete_user(user_id)

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )
