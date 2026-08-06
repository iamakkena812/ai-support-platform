"""Dependencies for the workflow module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from .repository import WorkflowRepository
from .service import WorkflowService

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


def get_workflow_repository(
    session: DatabaseSession,
) -> WorkflowRepository:
    """Return a workflow repository instance.

    Args:
        session: Database session.

    Returns:
        Workflow repository.
    """
    return WorkflowRepository(session)


WorkflowRepositoryDependency = Annotated[
    WorkflowRepository,
    Depends(get_workflow_repository),
]


def get_workflow_service(
    session: DatabaseSession,
) -> WorkflowService:
    """Return a workflow service instance.

    Args:
        session: Database session.

    Returns:
        Workflow service.
    """
    repository = WorkflowRepository(session)
    return WorkflowService(repository)


WorkflowServiceDependency = Annotated[
    WorkflowService,
    Depends(get_workflow_service),
]
