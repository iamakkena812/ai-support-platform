"""Dependency providers for Team module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.repositories.organization import OrganizationRepository
from app.repositories.user import UserRepository
from app.teams.repository import TeamRepository
from app.teams.service import TeamService


def get_team_repository(
    session: Annotated[Session, Depends(get_db)],
) -> TeamRepository:
    """Return TeamRepository."""
    return TeamRepository(session)


def get_team_service(
    session: Annotated[Session, Depends(get_db)],
) -> TeamService:
    """Return TeamService."""
    return TeamService(
        repository=TeamRepository(session),
        organization_repository=OrganizationRepository(session),
        user_repository=UserRepository(session),
    )


TeamRepositoryDependency = Annotated[
    TeamRepository,
    Depends(get_team_repository),
]

TeamServiceDependency = Annotated[
    TeamService,
    Depends(get_team_service),
]
