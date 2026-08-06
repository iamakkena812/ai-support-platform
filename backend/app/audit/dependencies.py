"""Dependencies for the audit module."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.audit.repository import AuditRepository
from app.audit.service import AuditService
from app.database.dependencies import get_db

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


def get_audit_repository(
    session: DatabaseSession,
) -> AuditRepository:
    """Return an audit repository."""
    return AuditRepository(session)


AuditRepositoryDependency = Annotated[
    AuditRepository,
    Depends(get_audit_repository),
]


def get_audit_service(
    repository: AuditRepositoryDependency,
) -> AuditService:
    """Return an audit service."""
    return AuditService(repository)


AuditServiceDependency = Annotated[
    AuditService,
    Depends(get_audit_service),
]
