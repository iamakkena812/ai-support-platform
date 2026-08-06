"""Service layer for audit logs."""

from __future__ import annotations

import builtins
from uuid import UUID

from app.audit.exceptions import (
    AuditLoggingError,
    AuditLogNotFoundError,
)
from app.audit.models import AuditLog
from app.audit.repository import AuditRepository
from app.audit.schemas import (
    AuditLogCreate,
    AuditLogSearch,
)


class AuditService:
    """Service for audit log operations."""

    def __init__(
        self,
        repository: AuditRepository,
    ) -> None:
        """Initialize the service."""
        self._repository = repository

    def create(
        self,
        request: AuditLogCreate,
    ) -> AuditLog:
        """Create an audit log."""
        audit_log = AuditLog(
            organization_id=request.organization_id,
            user_id=request.user_id,
            action=request.action,
            entity_type=request.entity_type,
            entity_id=request.entity_id,
            entity_name=request.entity_name,
            old_values=request.old_values,
            new_values=request.new_values,
            ip_address=request.ip_address,
            user_agent=request.user_agent,
            request_id=request.request_id,
            status=request.status,
        )

        try:
            return self._repository.create(audit_log)
        except Exception as exc:  # pragma: no cover
            raise AuditLoggingError() from exc

    def get(
        self,
        audit_log_id: UUID,
    ) -> AuditLog:
        """Retrieve an audit log."""
        audit_log = self._repository.get(
            audit_log_id,
        )

        if audit_log is None:
            raise AuditLogNotFoundError()

        return audit_log

    def list(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
    ) -> builtins.list[AuditLog]:
        """Return audit logs."""
        return self._repository.list(
            offset=offset,
            limit=limit,
        )

    def search(
        self,
        filters: AuditLogSearch,
    ) -> builtins.list[AuditLog]:
        """Search audit logs."""
        return self._repository.search(
            filters,
        )

    def count(
        self,
        filters: AuditLogSearch,
    ) -> int:
        """Count matching audit logs."""
        return self._repository.count(
            filters,
        )

    def get_entity_history(
        self,
        entity_type: str,
        entity_id: UUID,
    ) -> builtins.list[AuditLog]:
        """Return audit history for an entity."""
        return self.search(
            AuditLogSearch(
                entity_type=entity_type,
                entity_id=entity_id,
            ),
        )

    def get_user_history(
        self,
        user_id: UUID,
    ) -> builtins.list[AuditLog]:
        """Return audit history for a user."""
        return self.search(
            AuditLogSearch(
                user_id=user_id,
            ),
        )

    def get_organization_history(
        self,
        organization_id: UUID,
    ) -> builtins.list[AuditLog]:
        """Return audit history for an organization."""
        return self.search(
            AuditLogSearch(
                organization_id=organization_id,
            ),
        )
