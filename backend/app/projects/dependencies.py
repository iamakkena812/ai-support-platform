"""Project dependencies."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.projects.service import ProjectService
from app.repositories.project import ProjectRepository

SessionDependency = Annotated[
    Session,
    Depends(get_db),
]

ProjectRepositoryDependency = Annotated[
    ProjectRepository,
    Depends(lambda session: ProjectRepository(session)),
]


def get_project_repository(
    session: SessionDependency,
) -> ProjectRepository:
    """Return a project repository."""
    return ProjectRepository(session)


def get_project_service(
    repository: Annotated[
        ProjectRepository,
        Depends(get_project_repository),
    ],
) -> ProjectService:
    """Return a project service."""
    return ProjectService(repository)


ProjectServiceDependency = Annotated[
    ProjectService,
    Depends(get_project_service),
]
