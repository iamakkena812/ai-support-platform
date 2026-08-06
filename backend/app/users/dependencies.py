"""User dependencies."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends

from app.core.dependencies import DatabaseDependency
from app.organizations.repository import OrganizationRepository
from app.repositories.user import UserRepository
from app.users.service import UserService


def get_user_service(
    db: DatabaseDependency,
) -> UserService:
    """Return a configured UserService."""
    return UserService(
        user_repository=UserRepository(db),
        organization_repository=OrganizationRepository(db),
    )


UserServiceDependency = Annotated[
    UserService,
    Depends(get_user_service),
]
