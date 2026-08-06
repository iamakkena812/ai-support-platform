"""RBAC dependencies."""

from __future__ import annotations

from collections.abc import Callable, Coroutine
from typing import Annotated, Any

from fastapi import Depends, HTTPException

from app.auth.dependencies import CurrentActiveUserDependency
from app.core.dependencies import DatabaseDependency
from app.models.user import User
from app.rbac.service import RBACService


def get_rbac_service(
    db: DatabaseDependency,
) -> RBACService:
    """Return an RBAC service."""
    return RBACService(db)


RBACServiceDependency = Annotated[
    RBACService,
    Depends(get_rbac_service),
]


def require_permission(
    resource: str,
    action: str,
) -> Callable[
    [CurrentActiveUserDependency, RBACServiceDependency],
    Coroutine[Any, Any, User],
]:
    """Return a dependency that checks a user's permission."""

    async def dependency(
        current_user: CurrentActiveUserDependency,
        rbac_service: RBACServiceDependency,
    ) -> User:
        """Validate that the current user has the required permission."""
        # Superusers bypass RBAC checks.
        if current_user.is_superuser:
            return current_user

        if not rbac_service.has_permission(
            current_user.id,
            resource,
            action,
        ):
            raise HTTPException(
                status_code=403,
                detail="Permission denied",
            )

        return current_user

    return dependency
