"""Organization dependency providers."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.organizations.repository import (
    OrganizationRepository,
)
from app.organizations.service import (
    OrganizationService,
)


def get_organization_repository(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
) -> OrganizationRepository:
    """Return an organization repository.

    Args:
        db: Database session.

    Returns:
        Organization repository.
    """
    return OrganizationRepository(db)


def get_organization_service(
    repository: Annotated[
        OrganizationRepository,
        Depends(get_organization_repository),
    ],
) -> OrganizationService:
    """Return an organization service.

    Args:
        repository: Organization repository.

    Returns:
        Organization service.
    """
    return OrganizationService(repository)


OrganizationRepositoryDependency = Annotated[
    OrganizationRepository,
    Depends(get_organization_repository),
]

OrganizationServiceDependency = Annotated[
    OrganizationService,
    Depends(get_organization_service),
]
