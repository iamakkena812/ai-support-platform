"""Tests for AuditRepository."""

from __future__ import annotations

import uuid

import pytest
from sqlalchemy.orm import Session

from app.audit.models import AuditLog
from app.audit.repository import AuditRepository
from app.audit.schemas import AuditLogSearch


@pytest.fixture
def repository(
    db_session: Session,
) -> AuditRepository:
    """Return an audit repository."""
    return AuditRepository(db_session)


def test_create_audit_log(
    repository: AuditRepository,
    audit_log: AuditLog,
) -> None:
    """Test creating an audit log."""
    created = repository.create(audit_log)

    assert created.id == audit_log.id

    retrieved = repository.get(created.id)

    assert retrieved is not None
    assert retrieved.id == created.id
    assert retrieved.action == created.action
    assert retrieved.entity_type == created.entity_type


def test_get_audit_log(
    repository: AuditRepository,
    audit_log: AuditLog,
) -> None:
    """Test retrieving an audit log."""
    result = repository.get(audit_log.id)

    assert result is not None
    assert result.id == audit_log.id


def test_get_missing_audit_log(
    repository: AuditRepository,
) -> None:
    """Test retrieving a missing audit log."""
    assert repository.get(uuid.uuid4()) is None


def test_list_audit_logs(
    repository: AuditRepository,
    audit_log: AuditLog,
) -> None:
    """Test listing audit logs."""
    result = repository.list()

    assert audit_log in result


def test_search_by_organization(
    repository: AuditRepository,
    audit_log: AuditLog,
) -> None:
    """Test searching by organization."""
    filters = AuditLogSearch(
        organization_id=audit_log.organization_id,
    )

    result = repository.search(filters)

    assert audit_log in result


def test_search_by_user(
    repository: AuditRepository,
    audit_log: AuditLog,
) -> None:
    """Test searching by user."""
    filters = AuditLogSearch(
        user_id=audit_log.user_id,
    )

    result = repository.search(filters)

    assert audit_log in result


def test_search_by_action(
    repository: AuditRepository,
    audit_log: AuditLog,
) -> None:
    """Test searching by action."""
    filters = AuditLogSearch(
        action=audit_log.action,
    )

    result = repository.search(filters)

    assert audit_log in result


def test_search_by_entity(
    repository: AuditRepository,
    audit_log: AuditLog,
) -> None:
    """Test searching by entity."""
    filters = AuditLogSearch(
        entity_type=audit_log.entity_type,
        entity_id=audit_log.entity_id,
    )

    result = repository.search(filters)

    assert audit_log in result


def test_count_audit_logs(
    repository: AuditRepository,
    audit_log: AuditLog,
) -> None:
    """Test counting audit logs."""
    filters = AuditLogSearch(
        organization_id=audit_log.organization_id,
    )

    count = repository.count(filters)

    assert count >= 1


def test_empty_search(
    repository: AuditRepository,
) -> None:
    """Test empty search."""
    result = repository.search(
        AuditLogSearch(),
    )

    assert len(result) == 0
