"""Permission module dependencies."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.permissions.repository import PermissionRepository
from app.permissions.service import PermissionService


def get_permission_repository(
    db: Session = Depends(get_db),
) -> PermissionRepository:
    """Return a permission repository.

    Args:
        db: Database session.

    Returns:
        Configured permission repository.
    """
    return PermissionRepository(db)


def get_permission_service(
    db: Session = Depends(get_db),
) -> PermissionService:
    """Return a permission service.

    Args:
        db: Database session.

    Returns:
        Configured permission service.
    """
    repository = PermissionRepository(db)

    return PermissionService(
        db=db,
        repository=repository,
    )


PermissionRepositoryDependency = Annotated[
    PermissionRepository,
    Depends(get_permission_repository),
]

PermissionServiceDependency = Annotated[
    PermissionService,
    Depends(get_permission_service),
]


__all__ = [
    "PermissionRepositoryDependency",
    "PermissionServiceDependency",
    "get_permission_repository",
    "get_permission_service",
]