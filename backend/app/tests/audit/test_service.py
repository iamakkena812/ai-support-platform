"""Tests for AuditService."""

from __future__ import annotations

import uuid
from unittest.mock import MagicMock

import pytest

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
from app.audit.service import AuditService


@pytest.fixture
def repository() -> MagicMock:
    """Return a mocked repository."""
    return MagicMock(spec=AuditRepository)


@pytest.fixture
def service(
    repository: MagicMock,
) -> AuditService:
    """Return an audit service."""
    return AuditService(repository)


@pytest.fixture
def audit_log() -> AuditLog:
    """Return an audit log."""
    return AuditLog(
        organization_id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        action="create",
        entity_type="ticket",
        entity_id=uuid.uuid4(),
        entity_name="Ticket-1",
        old_values=None,
        new_values={"status": "open"},
        ip_address="127.0.0.1",
        user_agent="pytest",
        request_id="req-123",
        status="success",
    )


def test_create_audit_log(
    service: AuditService,
    repository: MagicMock,
    audit_log: AuditLog,
) -> None:
    """Test creating an audit log."""
    repository.create.return_value = audit_log

    request = AuditLogCreate(
        organization_id=audit_log.organization_id,
        user_id=audit_log.user_id,
        action=audit_log.action,
        entity_type=audit_log.entity_type,
        entity_id=audit_log.entity_id,
        entity_name=audit_log.entity_name,
        old_values=audit_log.old_values,
        new_values=audit_log.new_values,
        ip_address=audit_log.ip_address,
        user_agent=audit_log.user_agent,
        request_id=audit_log.request_id,
        status=audit_log.status,
    )

    result = service.create(request)

    assert result == audit_log
    repository.create.assert_called_once()


def test_create_raises_logging_error(
    service: AuditService,
    repository: MagicMock,
    audit_log: AuditLog,
) -> None:
    """Test create failure."""
    repository.create.side_effect = Exception()

    request = AuditLogCreate(
        organization_id=audit_log.organization_id,
        user_id=audit_log.user_id,
        action=audit_log.action,
        entity_type=audit_log.entity_type,
        entity_id=audit_log.entity_id,
        entity_name=audit_log.entity_name,
        old_values=audit_log.old_values,
        new_values=audit_log.new_values,
        ip_address=audit_log.ip_address,
        user_agent=audit_log.user_agent,
        request_id=audit_log.request_id,
        status=audit_log.status,
    )

    with pytest.raises(AuditLoggingError):
        service.create(request)


def test_get_returns_audit_log(
    service: AuditService,
    repository: MagicMock,
    audit_log: AuditLog,
) -> None:
    """Test retrieving an audit log."""
    repository.get.return_value = audit_log

    result = service.get(audit_log.id)

    assert result == audit_log


def test_get_not_found(
    service: AuditService,
    repository: MagicMock,
) -> None:
    """Test missing audit log."""
    repository.get.return_value = None

    with pytest.raises(AuditLogNotFoundError):
        service.get(uuid.uuid4())


def test_list_returns_logs(
    service: AuditService,
    repository: MagicMock,
    audit_log: AuditLog,
) -> None:
    """Test listing audit logs."""
    repository.list.return_value = [audit_log]

    result = service.list()

    assert result == [audit_log]


def test_search_returns_logs(
    service: AuditService,
    repository: MagicMock,
    audit_log: AuditLog,
) -> None:
    """Test searching audit logs."""
    filters = AuditLogSearch()

    repository.search.return_value = [audit_log]

    result = service.search(filters)

    assert result == [audit_log]


def test_count(
    service: AuditService,
    repository: MagicMock,
) -> None:
    """Test counting audit logs."""
    repository.count.return_value = 5

    result = service.count(AuditLogSearch())

    assert result == 5


def test_entity_history(
    service: AuditService,
    repository: MagicMock,
    audit_log: AuditLog,
) -> None:
    """Test entity history."""
    repository.search.return_value = [audit_log]

    assert audit_log.entity_id is not None

    result = service.get_entity_history(
        audit_log.entity_type,
        audit_log.entity_id,
    )
    assert result == [audit_log]


def test_user_history(
    service: AuditService,
    repository: MagicMock,
    audit_log: AuditLog,
) -> None:
    """Test user history."""
    repository.search.return_value = [audit_log]

    assert audit_log.user_id is not None

    result = service.get_user_history(
        audit_log.user_id,
    )

    assert result == [audit_log]


def test_organization_history(
    service: AuditService,
    repository: MagicMock,
    audit_log: AuditLog,
) -> None:
    """Test organization history."""
    repository.search.return_value = [audit_log]

    result = service.get_organization_history(
        audit_log.organization_id,
    )

    assert result == [audit_log]
