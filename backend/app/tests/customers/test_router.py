"""Customer router tests."""

from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.customers.constants import (
    CustomerStatus,
    CustomerType,
)
from app.models.organization import Organization
from app.models.user import User


def test_create_customer(
    client: TestClient,
    auth_headers: dict[str, str],
    organization: Organization,
    user: User,
) -> None:
    """Create a customer."""
    response = client.post(
        "/api/v1/customers",
        headers=auth_headers,
        json={
            "name": "John Doe",
            "company_name": "OpenAI",
            "email": "john@example.com",
            "phone": "9876543210",
            "website": "https://example.com",
            "address": "123 Main Street",
            "city": "Hyderabad",
            "state": "Telangana",
            "country": "India",
            "postal_code": "500001",
            "customer_type": CustomerType.BUSINESS.value,
            "status": CustomerStatus.ACTIVE.value,
        },
    )

    assert response.status_code == 201

    body = response.json()

    assert body["name"] == "John Doe"
    assert body["email"] == "john@example.com"
    assert body["company_name"] == "OpenAI"


def test_list_customers(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List customers."""
    response = client.get(
        "/api/v1/customers",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_missing_customer(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for a missing customer."""
    response = client.get(
        f"/api/v1/customers/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_customer(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Update an existing customer."""
    create_response = client.post(
        "/api/v1/customers",
        headers=auth_headers,
        json={
            "name": "John Doe",
            "company_name": "OpenAI",
            "email": "update@example.com",
            "phone": "9876543210",
            "website": "https://example.com",
            "address": "123 Main Street",
            "city": "Hyderabad",
            "state": "Telangana",
            "country": "India",
            "postal_code": "500001",
            "customer_type": CustomerType.BUSINESS.value,
            "status": CustomerStatus.ACTIVE.value,
        },
    )

    assert create_response.status_code == 201

    customer_id = create_response.json()["id"]

    response = client.put(
        f"/api/v1/customers/{customer_id}",
        headers=auth_headers,
        json={
            "name": "Updated Customer",
            "status": CustomerStatus.INACTIVE.value,
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["name"] == "Updated Customer"
    assert body["status"] == CustomerStatus.INACTIVE.value


def test_delete_customer(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Delete a customer."""
    create_response = client.post(
        "/api/v1/customers",
        headers=auth_headers,
        json={
            "name": "Delete Customer",
            "company_name": "OpenAI",
            "email": "delete@example.com",
            "phone": "9876543210",
            "website": "https://example.com",
            "address": "123 Main Street",
            "city": "Hyderabad",
            "state": "Telangana",
            "country": "India",
            "postal_code": "500001",
            "customer_type": CustomerType.BUSINESS.value,
            "status": CustomerStatus.ACTIVE.value,
        },
    )

    assert create_response.status_code == 201

    customer_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/customers/{customer_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    response = client.get(
        f"/api/v1/customers/{customer_id}",
        headers=auth_headers,
    )

    assert response.status_code == 404
