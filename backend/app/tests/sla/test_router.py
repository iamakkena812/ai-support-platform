"""Tests for SLA router."""

from __future__ import annotations

from collections.abc import Generator
from unittest.mock import MagicMock

import pytest
from app.main import app
from app.sla.constants import SLAPriority
from app.sla.dependencies import get_sla_service
from app.sla.models import SLAEvent, SLAPolicy
from app.sla.schemas import (
    SLAPolicyCreate,
    SLAPolicyUpdate,
)
from fastapi.testclient import TestClient


@pytest.fixture
def service() -> MagicMock:
    """Return mocked SLA service."""
    return MagicMock()


@pytest.fixture
def client(
    service: MagicMock,
) -> Generator[TestClient]:
    """Return configured test client."""
    app.dependency_overrides[get_sla_service] = lambda: service

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def test_list_policies(
    client: TestClient,
    service: MagicMock,
    sla_policy: SLAPolicy,
) -> None:
    """Test listing SLA policies."""
    service.list_policies.return_value = [sla_policy]

    response = client.get(
        "/api/v1/sla/policies",
    )

    assert response.status_code == 200
    assert len(response.json()) == 1

    service.list_policies.assert_called_once_with()


def test_create_policy(
    client: TestClient,
    service: MagicMock,
    sla_policy: SLAPolicy,
) -> None:
    """Test creating SLA policy."""
    payload = SLAPolicyCreate(
        organization_id=sla_policy.organization_id,
        name=sla_policy.name,
        description=sla_policy.description,
        priority=SLAPriority(sla_policy.priority),
        first_response_minutes=sla_policy.first_response_minutes,
        resolution_minutes=sla_policy.resolution_minutes,
        business_hours_only=sla_policy.business_hours_only,
        is_active=sla_policy.is_active,
    )

    service.create_policy.return_value = sla_policy

    response = client.post(
        "/api/v1/sla/policies",
        json=payload.model_dump(mode="json"),
    )

    assert response.status_code == 201

    service.create_policy.assert_called_once()


def test_get_policy(
    client: TestClient,
    service: MagicMock,
    sla_policy: SLAPolicy,
) -> None:
    """Test retrieving SLA policy."""
    service.get_policy.return_value = sla_policy

    response = client.get(
        f"/api/v1/sla/policies/{sla_policy.id}",
    )

    assert response.status_code == 200

    service.get_policy.assert_called_once_with(
        sla_policy.id,
    )


def test_update_policy(
    client: TestClient,
    service: MagicMock,
    sla_policy: SLAPolicy,
) -> None:
    """Test updating SLA policy."""
    payload = SLAPolicyUpdate(
        name="Updated SLA",
    )

    sla_policy.name = "Updated SLA"

    service.update_policy.return_value = sla_policy

    response = client.patch(
        f"/api/v1/sla/policies/{sla_policy.id}",
        json=payload.model_dump(
            exclude_unset=True,
            mode="json",
        ),
    )

    assert response.status_code == 200

    service.update_policy.assert_called_once()


def test_delete_policy(
    client: TestClient,
    service: MagicMock,
    sla_policy: SLAPolicy,
) -> None:
    """Test deleting SLA policy."""
    response = client.delete(
        f"/api/v1/sla/policies/{sla_policy.id}",
    )

    assert response.status_code == 204

    service.delete_policy.assert_called_once_with(
        sla_policy.id,
    )


def test_list_breached(
    client: TestClient,
    service: MagicMock,
    sla_event: SLAEvent,
) -> None:
    """Test listing breached tickets."""
    sla_event.first_response_breached = True

    service.list_breached_tickets.return_value = [
        sla_event,
    ]

    response = client.get(
        "/api/v1/sla/breached",
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["ticket_id"] == str(sla_event.ticket_id)
    assert data[0]["policy_id"] == str(sla_event.policy_id)
    assert data[0]["first_response_breached"] is True
    assert data[0]["resolution_breached"] is False

    service.list_breached_tickets.assert_called_once_with()


def test_get_ticket_sla(
    client: TestClient,
    service: MagicMock,
    sla_event: SLAEvent,
) -> None:
    """Test retrieving ticket SLA."""
    service.get_sla_event.return_value = sla_event

    response = client.get(
        f"/api/v1/sla/tickets/{sla_event.ticket_id}",
    )

    assert response.status_code == 200

    data = response.json()

    assert data["ticket_id"] == str(sla_event.ticket_id)
    assert data["policy_id"] == str(sla_event.policy_id)

    service.get_sla_event.assert_called_once_with(
        sla_event.ticket_id,
    )
