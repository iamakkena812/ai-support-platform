"""Tests for authentication router."""

from __future__ import annotations

from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.auth.dependencies import (
    get_authentication_service,
    get_current_user,
)
from app.auth.router import router
from app.auth.service import (
    EmailAlreadyExistsError,
    UsernameAlreadyExistsError,
)
from app.models.user import User

app = FastAPI()
app.include_router(router, prefix="/api/v1")


class TestAuthenticationRouter:
    """Authentication router tests."""

    @pytest.fixture
    def client(self) -> TestClient:
        """Return a FastAPI test client."""
        return TestClient(app)

    @pytest.fixture
    def user(self) -> MagicMock:
        """Return a mocked authenticated user."""
        user = MagicMock(spec=User)

        user.id = uuid4()
        user.organization_id = uuid4()
        user.email = "john@example.com"
        user.username = "john"
        user.full_name = "John Doe"
        user.is_active = True
        user.is_superuser = False

        return user

    @pytest.fixture
    def auth_service(self) -> MagicMock:
        """Return mocked authentication service."""
        return MagicMock()

    def test_login_success(
        self,
        client: TestClient,
        auth_service: MagicMock,
        user: User,
    ) -> None:
        """Authenticate successfully."""
        auth_service.authenticate.return_value = "jwt-token"

        app.dependency_overrides[get_authentication_service] = lambda: auth_service

        try:
            response = client.post(
                "/api/v1/auth/login",
                json={
                    "email": "john@example.com",
                    "password": "password",
                },
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 200

        body = response.json()

        assert body["access_token"] == "jwt-token"
        assert body["token_type"] == "bearer"
        assert "user" not in body

    def test_login_validation_error(
        self,
        client: TestClient,
    ) -> None:
        """Reject invalid request payload."""
        response = client.post(
            "/api/v1/auth/login",
            json={},
        )

        assert response.status_code == 422

    def test_me_success(
        self,
        client: TestClient,
        user: User,
    ) -> None:
        """Return current authenticated user."""
        app.dependency_overrides[get_current_user] = lambda: user

        try:
            response = client.get("/api/v1/auth/me")
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 200

        body = response.json()

        assert body["email"] == user.email
        assert body["username"] == user.username
        assert body["full_name"] == user.full_name

    def test_me_unauthorized(
        self,
        client: TestClient,
    ) -> None:
        """Authentication is required."""
        response = client.get("/api/v1/auth/me")

        assert response.status_code in (401, 403)

    def test_logout(
        self,
        client: TestClient,
    ) -> None:
        """Logout endpoint."""
        response = client.post("/api/v1/auth/logout")

        assert response.status_code == 204

    def test_register_success(
        self,
        client: TestClient,
        auth_service: MagicMock,
        user: User,
    ) -> None:
        """Register a new user."""
        auth_service.register.return_value = user

        app.dependency_overrides[get_authentication_service] = lambda: auth_service

        try:
            response = client.post(
                "/api/v1/auth/register",
                json={
                    "email": user.email,
                    "username": user.username,
                    "full_name": user.full_name,
                    "password": "Password@123",
                    "organization_id": str(user.organization_id),
                },
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 201

        body = response.json()

        assert body["email"] == user.email
        assert body["username"] == user.username
        assert body["full_name"] == user.full_name

    def test_register_duplicate_email(
        self,
        client: TestClient,
        auth_service: MagicMock,
        user: User,
    ) -> None:
        """Duplicate email should return 409."""
        auth_service.register.side_effect = EmailAlreadyExistsError(
            "Email is already registered.",
        )

        app.dependency_overrides[get_authentication_service] = lambda: auth_service

        try:
            response = client.post(
                "/api/v1/auth/register",
                json={
                    "email": user.email,
                    "username": "another",
                    "password": "Password@123",
                    "organization_id": str(user.organization_id),
                },
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 409

    def test_register_duplicate_username(
        self,
        client: TestClient,
        auth_service: MagicMock,
        user: User,
    ) -> None:
        """Duplicate username should return 409."""
        auth_service.register.side_effect = UsernameAlreadyExistsError(
            "Username is already taken.",
        )

        app.dependency_overrides[get_authentication_service] = lambda: auth_service

        try:
            response = client.post(
                "/api/v1/auth/register",
                json={
                    "email": "another@example.com",
                    "username": user.username,
                    "password": "Password@123",
                    "organization_id": str(user.organization_id),
                },
            )
        finally:
            app.dependency_overrides.clear()

        assert response.status_code == 409

    def test_register_validation_error(
        self,
        client: TestClient,
    ) -> None:
        """Invalid registration request."""
        response = client.post(
            "/api/v1/auth/register",
            json={},
        )

        assert response.status_code == 422
