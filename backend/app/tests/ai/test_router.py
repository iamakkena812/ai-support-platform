"""Test router for AI."""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.ai.constants import (
    AIModel,
    AIProvider,
    AIRequestType,
)


def test_chat(
    client: TestClient,
) -> None:
    """Test AI chat endpoint."""
    response = client.post(
        "/api/v1/ai/chat",
        json={
            "provider": AIProvider.MOCK,
            "model": AIModel.GPT_4_1,
            "request_type": AIRequestType.CHAT,
            "messages": [
                {
                    "role": "user",
                    "content": "Hello",
                }
            ],
            "temperature": 0.2,
            "max_tokens": 256,
            "stream": False,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["provider"] == AIProvider.MOCK
    assert data["model"] == AIModel.GPT_4_1
    assert data["content"] == "Mock AI response."


def test_completion(
    client: TestClient,
) -> None:
    """Test AI completion endpoint."""
    response = client.post(
        "/api/v1/ai/completion",
        json={
            "provider": AIProvider.MOCK,
            "model": AIModel.GPT_4_1,
            "request_type": AIRequestType.COMPLETION,
            "messages": [
                {
                    "role": "user",
                    "content": "Write a poem",
                }
            ],
            "temperature": 0.2,
            "max_tokens": 256,
            "stream": False,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["content"] == "Mock AI response."


def test_health(
    client: TestClient,
) -> None:
    """Test AI health endpoint."""
    response = client.get("/api/v1/ai/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert "default_provider" in data
    assert "providers" in data
    assert "available_models" in data


def test_configuration(
    client: TestClient,
) -> None:
    """Test AI configuration endpoint."""
    response = client.get("/api/v1/ai/configuration")

    assert response.status_code == 200

    data = response.json()

    assert data["default_provider"] == AIProvider.OPENAI
    assert data["default_model"] == AIModel.GPT_4_1
