"""Repository for audit logs."""

from __future__ import annotations

import builtins
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.audit.models import AuditLog
from app.audit.schemas import AuditLogSearch


class AuditRepository:
    """Repository for audit log persistence."""

    def __init__(
        self,
        session: Session,
    ) -> None:
        """Initialize the repository."""
        self._session = session

    def create(
        self,
        audit_log: AuditLog,
    ) -> AuditLog:
        """Create an audit log."""
        self._session.add(audit_log)
        self._session.commit()
        self._session.refresh(audit_log)
        return audit_log

    def get(
        self,
        audit_log_id: UUID,
    ) -> AuditLog | None:
        """Retrieve an audit log by ID."""
        statement = select(AuditLog).where(
            AuditLog.id == audit_log_id,
        )

        return self._session.scalar(statement)

    def list(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> builtins.list[AuditLog]:
        """Return audit logs."""
        statement = (
            select(AuditLog)
            .order_by(AuditLog.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        return builtins.list(self._session.scalars(statement).all())

    def search(
        self,
        filters: AuditLogSearch,
    ) -> builtins.list[AuditLog]:
        """Search audit logs."""
        statement = select(AuditLog)

        if filters.organization_id is not None:
            statement = statement.where(
                AuditLog.organization_id == filters.organization_id,
            )

        if filters.user_id is not None:
            statement = statement.where(
                AuditLog.user_id == filters.user_id,
            )

        if filters.action is not None:
            statement = statement.where(
                AuditLog.action == filters.action,
            )

        if filters.entity_type is not None:
            statement = statement.where(
                AuditLog.entity_type == filters.entity_type,
            )

        if filters.entity_id is not None:
            statement = statement.where(
                AuditLog.entity_id == filters.entity_id,
            )

        if filters.status is not None:
            statement = statement.where(
                AuditLog.status == filters.status,
            )

        statement = (
            statement.order_by(AuditLog.created_at.desc())
            .offset((filters.page - 1) * filters.page_size)
            .limit(filters.page_size)
        )

        return builtins.list(
            self._session.scalars(statement).all(),
        )

    def count(
        self,
        filters: AuditLogSearch,
    ) -> int:
        """Return the number of matching audit logs."""
        statement = select(func.count()).select_from(AuditLog)

        if filters.organization_id is not None:
            statement = statement.where(
                AuditLog.organization_id == filters.organization_id,
            )

        if filters.user_id is not None:
            statement = statement.where(
                AuditLog.user_id == filters.user_id,
            )

        if filters.action is not None:
            statement = statement.where(
                AuditLog.action == filters.action,
            )

        if filters.entity_type is not None:
            statement = statement.where(
                AuditLog.entity_type == filters.entity_type,
            )

        if filters.entity_id is not None:
            statement = statement.where(
                AuditLog.entity_id == filters.entity_id,
            )

        if filters.status is not None:
            statement = statement.where(
                AuditLog.status == filters.status,
            )

        result = self._session.scalar(statement)

        return int(result or 0)
