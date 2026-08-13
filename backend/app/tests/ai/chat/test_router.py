"""Tests for the AI chat router."""

from __future__ import annotations

from typing import cast
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.ai.constants import AIModel, AIProvider
from app.auth.password import hash_password
from app.models.organization import Organization
from app.models.user import User


def build_conversation_payload(**overrides: object) -> dict[str, object]:
    """Build a conversation creation payload."""
    payload: dict[str, object] = {
        "title": "Test Conversation",
        "provider": AIProvider.MOCK.value,
        "model": AIModel.GPT_4_1.value,
    }
    payload.update(overrides)

    return payload


def create_conversation(
    client: TestClient,
    auth_headers: dict[str, str],
    **overrides: object,
) -> dict[str, object]:
    """Create a conversation and return the response body."""
    response = client.post(
        "/api/v1/ai/chat/conversations",
        headers=auth_headers,
        json=build_conversation_payload(**overrides),
    )

    assert response.status_code == 201

    return cast(dict[str, object], response.json())


def _create_teammate(
    db_session: Session,
    client: TestClient,
    organization: Organization,
) -> tuple[User, dict[str, str]]:
    """Create a second user in the same organization and return auth headers."""
    unique = uuid4().hex[:8]

    teammate = User(
        organization_id=organization.id,
        email=f"{unique}@example.com",
        username=f"teammate{unique}",
        full_name="Teammate User",
        password_hash=hash_password("Password123!"),
        is_active=True,
    )
    db_session.add(teammate)
    db_session.commit()
    db_session.refresh(teammate)

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": teammate.email, "password": "Password123!"},
    )
    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return teammate, {"Authorization": f"Bearer {token}"}


def _other_org_headers(
    client: TestClient,
    db_session: Session,
) -> tuple[User, dict[str, str]]:
    """Create a second organization/user and return their auth headers."""
    unique = uuid4().hex[:8]

    other_organization = Organization(
        name=f"Other Org {unique}",
        code=f"OTHERORG-{unique}",
        email=f"{unique}@other-example.com",
        phone="+919999999998",
        website="https://other-example.com",
        logo_url="https://other-example.com/logo.png",
        address="1 Other Street",
        city="Hyderabad",
        state="Telangana",
        country="India",
        postal_code="500002",
        timezone="Asia/Kolkata",
        is_active=True,
    )
    db_session.add(other_organization)
    db_session.commit()
    db_session.refresh(other_organization)

    other_user = User(
        organization_id=other_organization.id,
        email=f"{unique}@other-example.com",
        username=f"user{unique}",
        full_name="Other Org User",
        password_hash=hash_password("Password123!"),
        is_active=True,
    )
    db_session.add(other_user)
    db_session.commit()
    db_session.refresh(other_user)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": other_user.email, "password": "Password123!"},
    )
    assert response.status_code == 200

    token = response.json()["access_token"]

    return other_user, {"Authorization": f"Bearer {token}"}


def test_create_conversation(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Create a conversation owned by the caller."""
    body = create_conversation(client, auth_headers)

    assert body["title"] == "Test Conversation"
    assert body["status"] == "active"
    assert body["message_count"] == 0


def test_create_conversation_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous conversation creation."""
    response = client.post(
        "/api/v1/ai/chat/conversations",
        json=build_conversation_payload(),
    )

    assert response.status_code == 401


def test_create_conversation_rejects_invalid_provider(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Reject an unsupported provider value."""
    response = client.post(
        "/api/v1/ai/chat/conversations",
        headers=auth_headers,
        json=build_conversation_payload(provider="not-a-real-provider"),
    )

    assert response.status_code == 422


def test_list_conversations(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List the caller's conversations."""
    create_conversation(client, auth_headers)

    response = client.get(
        "/api/v1/ai/chat/conversations",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()
    assert body["total"] >= 1
    assert isinstance(body["items"], list)


def test_list_conversations_requires_authentication(
    client: TestClient,
) -> None:
    """Reject anonymous listing."""
    response = client.get("/api/v1/ai/chat/conversations")

    assert response.status_code == 401


def test_get_conversation(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Retrieve a conversation by ID."""
    created = create_conversation(client, auth_headers)

    response = client.get(
        f"/api/v1/ai/chat/conversations/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_get_missing_conversation(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for a missing conversation."""
    response = client.get(
        f"/api/v1/ai/chat/conversations/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_conversation(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Update a conversation as its owner."""
    created = create_conversation(client, auth_headers)

    response = client.patch(
        f"/api/v1/ai/chat/conversations/{created['id']}",
        headers=auth_headers,
        json={"title": "Renamed"},
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Renamed"


def test_send_message_returns_real_ai_response(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Send a message and receive a real (mock provider) AI response."""
    created = create_conversation(client, auth_headers)

    response = client.post(
        f"/api/v1/ai/chat/conversations/{created['id']}/chat",
        headers=auth_headers,
        json={"conversation_id": created["id"], "message": "Hello"},
    )

    assert response.status_code == 200

    body = response.json()
    assert body["user_message"]["content"] == "Hello"
    assert body["assistant_message"]["content"] == "Mock AI response."
    assert body["assistant_message"]["role"] == "assistant"


def test_send_message_path_mismatch_returns_400(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Reject a request body conversation ID that does not match the path."""
    created = create_conversation(client, auth_headers)

    response = client.post(
        f"/api/v1/ai/chat/conversations/{created['id']}/chat",
        headers=auth_headers,
        json={"conversation_id": str(uuid4()), "message": "Hello"},
    )

    assert response.status_code == 400


def test_send_message_requires_authentication(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Reject anonymous chat requests."""
    created = create_conversation(client, auth_headers)

    response = client.post(
        f"/api/v1/ai/chat/conversations/{created['id']}/chat",
        json={"conversation_id": created["id"], "message": "Hello"},
    )

    assert response.status_code == 401


def test_send_message_unimplemented_provider_returns_502(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 502 rather than a fake response when the provider is unavailable."""
    created = create_conversation(
        client,
        auth_headers,
        provider=AIProvider.ANTHROPIC.value,
    )

    response = client.post(
        f"/api/v1/ai/chat/conversations/{created['id']}/chat",
        headers=auth_headers,
        json={"conversation_id": created["id"], "message": "Hello"},
    )

    assert response.status_code == 502


def test_get_history(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Retrieve conversation history after sending a message."""
    created = create_conversation(client, auth_headers)

    client.post(
        f"/api/v1/ai/chat/conversations/{created['id']}/chat",
        headers=auth_headers,
        json={"conversation_id": created["id"], "message": "Hello"},
    )

    response = client.get(
        f"/api/v1/ai/chat/conversations/{created['id']}/messages",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()
    assert len(body["messages"]) == 2
    assert body["conversation"]["message_count"] == 2


def test_delete_conversation(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Delete a conversation and confirm it disappears."""
    created = create_conversation(client, auth_headers)

    response = client.delete(
        f"/api/v1/ai/chat/conversations/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    follow_up = client.get(
        f"/api/v1/ai/chat/conversations/{created['id']}",
        headers=auth_headers,
    )
    assert follow_up.status_code == 404


def test_conversation_is_isolated_from_other_users(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
    organization: Organization,
) -> None:
    """A conversation is invisible and inaccessible to a non-owner."""
    created = create_conversation(client, auth_headers)

    _teammate, teammate_headers = _create_teammate(
        db_session,
        client,
        organization,
    )

    get_response = client.get(
        f"/api/v1/ai/chat/conversations/{created['id']}",
        headers=teammate_headers,
    )
    assert get_response.status_code == 403

    list_response = client.get(
        "/api/v1/ai/chat/conversations",
        headers=teammate_headers,
    )
    assert all(
        item["id"] != created["id"] for item in list_response.json()["items"]
    )

    chat_response = client.post(
        f"/api/v1/ai/chat/conversations/{created['id']}/chat",
        headers=teammate_headers,
        json={"conversation_id": created["id"], "message": "Hijack"},
    )
    assert chat_response.status_code == 403


def test_conversation_is_isolated_from_other_organizations(
    client: TestClient,
    auth_headers: dict[str, str],
    db_session: Session,
) -> None:
    """A conversation created in one organization is invisible to another."""
    created = create_conversation(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    get_response = client.get(
        f"/api/v1/ai/chat/conversations/{created['id']}",
        headers=other_headers,
    )
    assert get_response.status_code == 404

    list_response = client.get(
        "/api/v1/ai/chat/conversations",
        headers=other_headers,
    )
    assert all(
        item["id"] != created["id"] for item in list_response.json()["items"]
    )
