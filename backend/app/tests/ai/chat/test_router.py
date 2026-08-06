"""Tests for AI chat router."""

from __future__ import annotations

from app.ai.chat.router import router
from fastapi import FastAPI
from fastapi.testclient import TestClient


def create_app() -> TestClient:
    """Create test application."""
    app = FastAPI()

    app.include_router(router)

    return TestClient(app)


def test_router_registered() -> None:
    """Router registers successfully."""
    client = create_app()

    response = client.get("/openapi.json")

    assert response.status_code == 200


def test_chat_routes_exist() -> None:
    """Ensure chat endpoints are registered."""
    client = create_app()

    schema = client.get("/openapi.json").json()

    paths = schema["paths"]

    assert "/ai/chat/conversations" in paths
