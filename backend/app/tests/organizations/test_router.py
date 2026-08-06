"""Tests for organization router."""

from __future__ import annotations

from datetime import UTC, datetime
from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.auth.dependencies import get_current_user
from app.core.exceptions import (
    AppException,
    ConflictException,
    ResourceNotFoundException,
)
from app.main import app
from app.models.organization import Organization
from app.models.user import User
from app.organizations.dependencies import (
    get_organization_service,
)

# app = FastAPI()
# app.include_router(router, prefix="/api/v1")


class TestOrganizationsRouter:
    """Organization router tests."""

    @pytest.fixture
    def client(self) -> TestClient:
        """Return test client."""
        return TestClient(app)

    @pytest.fixture
    def current_user(self) -> MagicMock:
        """Return authenticated user."""
        user = MagicMock(spec=User)

        user.id = uuid4()
        user.organization_id = uuid4()
        user.email = "admin@example.com"
        user.username = "admin"
        user.full_name = "Administrator"
        user.is_active = True
        user.is_superuser = True

        return user

    @pytest.fixture
    def organization(self) -> MagicMock:
        """Return a mock organization."""
        organization = MagicMock(spec=Organization)

        organization.id = uuid4()
        organization.name = "Test Organization"
        organization.code = "ORG001"
        organization.email = "org@example.com"
        organization.phone = "+919999999999"

        organization.website = "https://example.com"
        organization.logo_url = "https://example.com/logo.png"

        organization.address = "123 Test Street"
        organization.city = "Hyderabad"
        organization.state = "Telangana"
        organization.country = "India"
        organization.postal_code = "500001"
        organization.timezone = "Asia/Kolkata"

        organization.is_active = True

        organization.created_at = datetime.now(UTC)
        organization.updated_at = datetime.now(UTC)

        return organization

    @pytest.fixture
    def organization_service(self) -> MagicMock:
        """Return mocked organization service."""
        return MagicMock()

    def test_list_organizations(
        self,
        client: TestClient,
        current_user: User,
        organization: Organization,
        organization_service: MagicMock,
    ) -> None:
        """List organizations."""
        organization_service.list_organizations.return_value = [
            organization,
        ]

        app.dependency_overrides[get_current_user] = lambda: current_user
        app.dependency_overrides[get_organization_service] = (
            lambda: organization_service
        )

        try:
            response = client.get("/api/v1/organizations")
        finally:
            app.dependency_overrides.clear()

        print(response.status_code)
        print(response.json())  # <-- Add this

        assert response.status_code == 200

        body = response.json()

        assert len(body["organizations"]) == 1
        assert body["organizations"][0]["name"] == organization.name

    def test_get_organization(
        self,
        client: TestClient,
        current_user: User,
        organization: Organization,
        organization_service: MagicMock,
    ) -> None:
        """Get organization."""
        organization_service.get_organization.return_value = organization

        app.dependency_overrides[get_current_user] = lambda: current_user
        app.dependency_overrides[get_organization_service] = (
            lambda: organization_service
        )

        try:
            response = client.get(
                f"/api/v1/organizations/{organization.id}",
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 200
        assert response.json()["name"] == organization.name

    def test_get_missing_organization(
        self,
        client: TestClient,
        current_user: User,
        organization_service: MagicMock,
    ) -> None:
        """Unknown organization."""
        organization_service.get_organization.side_effect = ResourceNotFoundException(
            "Organization",
        )

        app.dependency_overrides[get_current_user] = lambda: current_user
        app.dependency_overrides[get_organization_service] = (
            lambda: organization_service
        )

        try:
            response = client.get(
                f"/api/v1/organizations/{uuid4()}",
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 404

    def test_create_organization(
        self,
        client: TestClient,
        current_user: User,
        organization: Organization,
        organization_service: MagicMock,
    ) -> None:
        """Create organization."""
        organization_service.create_organization.return_value = organization

        app.dependency_overrides[get_current_user] = lambda: current_user
        app.dependency_overrides[get_organization_service] = (
            lambda: organization_service
        )

        try:
            response = client.post(
                "/api/v1/organizations",
                json={
                    "name": "OpenAI",
                    "code": "OPENAI",
                    "email": "info@openai.com",
                },
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 201

    def test_create_duplicate_name(
        self,
        client: TestClient,
        current_user: User,
        organization_service: MagicMock,
    ) -> None:
        """Duplicate organization."""
        organization_service.create_organization.side_effect = ConflictException(
            "Organization name already exists.",
        )

        app.dependency_overrides[get_current_user] = lambda: current_user
        app.dependency_overrides[get_organization_service] = (
            lambda: organization_service
        )

        try:
            response = client.post(
                "/api/v1/organizations",
                json={
                    "name": "OpenAI",
                    "code": "OPENAI",
                },
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code in (
            400,
            409,
        )

    def test_update_organization(
        self,
        client: TestClient,
        current_user: User,
        organization: Organization,
        organization_service: MagicMock,
    ) -> None:
        """Update organization."""
        organization.name = "Updated"

        organization_service.update_organization.return_value = organization

        app.dependency_overrides[get_current_user] = lambda: current_user
        app.dependency_overrides[get_organization_service] = (
            lambda: organization_service
        )

        try:
            response = client.patch(
                f"/api/v1/organizations/{organization.id}",
                json={
                    "name": "Updated",
                },
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 200
        assert response.json()["name"] == "Updated"

    def test_delete_organization(
        self,
        client: TestClient,
        current_user: User,
        organization: Organization,
        organization_service: MagicMock,
    ) -> None:
        """Delete organization."""
        app.dependency_overrides[get_current_user] = lambda: current_user
        app.dependency_overrides[get_organization_service] = (
            lambda: organization_service
        )

        try:
            response = client.delete(
                f"/api/v1/organizations/{organization.id}",
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 204

    def test_requires_authentication(
        self,
        client: TestClient,
    ) -> None:
        """Authentication required."""
        response = client.get(
            "/api/v1/organizations",
        )

        assert response.status_code in (
            401,
            403,
        )

    def test_validation_error(
        self,
        client: TestClient,
        current_user: User,
        organization_service: MagicMock,
    ) -> None:
        """Validation error."""
        app.dependency_overrides[get_current_user] = lambda: current_user
        app.dependency_overrides[get_organization_service] = (
            lambda: organization_service
        )

        try:
            response = client.post(
                "/api/v1/organizations",
                json={},
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 422

    exc = ResourceNotFoundException("Organization")

    print(app.exception_handlers)
    print(AppException)
    print(app.exception_handlers.get(AppException))
