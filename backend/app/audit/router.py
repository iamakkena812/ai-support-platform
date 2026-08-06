"""API router for audit logs."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Query, status

from app.audit.dependencies import AuditServiceDependency
from app.audit.schemas import (
    AuditLogCreate,
    AuditLogCreateResponse,
    AuditLogList,
    AuditLogRead,
    AuditLogSearch,
)

router = APIRouter(
    prefix="/audit",
    tags=["Audit"],
)


@router.post(
    "",
    response_model=AuditLogCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_audit_log(
    request: AuditLogCreate,
    service: AuditServiceDependency,
) -> AuditLogCreateResponse:
    """Create an audit log."""
    audit_log = service.create(request)

    return AuditLogCreateResponse(
        audit_log=AuditLogRead.model_validate(audit_log),
    )


@router.get(
    "",
    response_model=AuditLogList,
)
def list_audit_logs(
    service: AuditServiceDependency,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
) -> AuditLogList:
    """List audit logs."""
    items = service.list(
        offset=offset,
        limit=limit,
    )

    total = service.count(AuditLogSearch())

    return AuditLogList(
        items=[AuditLogRead.model_validate(item) for item in items],
        total=total,
    )


@router.get(
    "/search",
    response_model=AuditLogList,
)
def search_audit_logs(
    service: AuditServiceDependency,
    organization_id: UUID | None = None,
    user_id: UUID | None = None,
    action: str | None = None,
    entity_type: str | None = None,
    entity_id: UUID | None = None,
    status: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
) -> AuditLogList:
    """Search audit logs."""
    filters = AuditLogSearch(
        organization_id=organization_id,
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        status=status,
        page=page,
        page_size=page_size,
    )

    items = service.search(filters)
    total = service.count(filters)

    return AuditLogList(
        items=[AuditLogRead.model_validate(item) for item in items],
        total=total,
    )


@router.get(
    "/entity/{entity_type}/{entity_id}",
    response_model=list[AuditLogRead],
)
def get_entity_history(
    entity_type: str,
    entity_id: UUID,
    service: AuditServiceDependency,
) -> list[AuditLogRead]:
    """Return audit history for an entity."""
    return [
        AuditLogRead.model_validate(item)
        for item in service.get_entity_history(
            entity_type,
            entity_id,
        )
    ]


@router.get(
    "/user/{user_id}",
    response_model=list[AuditLogRead],
)
def get_user_history(
    user_id: UUID,
    service: AuditServiceDependency,
) -> list[AuditLogRead]:
    """Return audit history for a user."""
    return [
        AuditLogRead.model_validate(item)
        for item in service.get_user_history(
            user_id,
        )
    ]


@router.get(
    "/{audit_log_id}",
    response_model=AuditLogRead,
)
def get_audit_log(
    audit_log_id: UUID,
    service: AuditServiceDependency,
) -> AuditLogRead:
    """Retrieve an audit log."""
    audit_log = service.get(audit_log_id)

    return AuditLogRead.model_validate(audit_log)
