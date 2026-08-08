"""Role management dependencies."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends

from app.auth.dependencies import CurrentActiveUserDependency
from app.core.dependencies import DatabaseDependency
from app.roles.repository import RoleRepository
from app.roles.service import RoleService


def get_role_service(
    db: DatabaseDependency,
    current_user: CurrentActiveUserDependency,
) -> RoleService:
    """Return a role service instance.

    Args:
        db: Database session.
        current_user: Authenticated user.

    Returns:
        Configured role service.
    """
    repository = RoleRepository(db)

    return RoleService(
        db,
        organization_id=current_user.organization_id,
        repository=repository,
    )


RoleServiceDependency = Annotated[
    RoleService,
    Depends(get_role_service),
]


__all__ = [
    "RoleServiceDependency",
    "get_role_service",
]