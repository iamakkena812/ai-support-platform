"""Tests for the AI Knowledge router."""

from __future__ import annotations

from typing import cast
from uuid import uuid4

from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth.password import hash_password
from app.models.organization import Organization
from app.models.user import User


def _knowledge_payload(**overrides: object) -> dict[str, object]:
    """Return a valid knowledge base creation payload."""
    payload: dict[str, object] = {
        "name": "Support Knowledge Base",
        "description": "Knowledge base for support docs",
    }
    payload.update(overrides)

    return payload


def _create_knowledge(
    client: TestClient,
    auth_headers: dict[str, str],
    **overrides: object,
) -> dict[str, object]:
    """Create a knowledge base and return the response body."""
    response = client.post(
        "/api/v1/knowledge",
        json=_knowledge_payload(**overrides),
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_201_CREATED

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


def test_create_knowledge(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test creating a knowledge base."""
    data = _create_knowledge(client, auth_headers)

    assert data["name"] == "Support Knowledge Base"
    assert data["visibility"] == "private"
    assert data["status"] == "active"


def test_create_knowledge_requires_authentication(
    client: TestClient,
) -> None:
    """Test creating a knowledge base requires authentication."""
    response = client.post(
        "/api/v1/knowledge",
        json=_knowledge_payload(),
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_create_knowledge_rejects_duplicate_name(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test creating a duplicate-named knowledge base fails."""
    _create_knowledge(client, auth_headers, name="Duplicate")

    response = client.post(
        "/api/v1/knowledge",
        json=_knowledge_payload(name="Duplicate"),
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_409_CONFLICT


def test_create_knowledge_validation(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test creating a knowledge base without a name fails validation."""
    payload = _knowledge_payload()
    payload.pop("name")

    response = client.post(
        "/api/v1/knowledge",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_list_knowledge(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test listing knowledge bases."""
    _create_knowledge(client, auth_headers)

    response = client.get(
        "/api/v1/knowledge",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert "items" in body
    assert "total" in body
    assert body["total"] >= 1


def test_list_knowledge_requires_authentication(
    client: TestClient,
) -> None:
    """Test listing knowledge bases requires authentication."""
    response = client.get("/api/v1/knowledge")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_list_knowledge_isolated_from_other_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
) -> None:
    """Test knowledge bases are not visible across organizations."""
    _create_knowledge(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        "/api/v1/knowledge",
        headers=other_headers,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["total"] == 0


def test_list_knowledge_excludes_teammates_private_items(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    organization: Organization,
) -> None:
    """Test a private knowledge base is not listed for teammates."""
    _create_knowledge(client, auth_headers, name="My Private KB")

    _teammate, teammate_headers = _create_teammate(db_session, client, organization)

    response = client.get(
        "/api/v1/knowledge",
        headers=teammate_headers,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["total"] == 0


def test_list_knowledge_includes_organization_visible_items(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    organization: Organization,
) -> None:
    """Test an organization-visible knowledge base is listed for teammates."""
    _create_knowledge(
        client,
        auth_headers,
        name="Shared KB",
        visibility="organization",
    )

    _teammate, teammate_headers = _create_teammate(db_session, client, organization)

    response = client.get(
        "/api/v1/knowledge",
        headers=teammate_headers,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["total"] == 1


def test_get_knowledge(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test retrieving a knowledge base."""
    created = _create_knowledge(client, auth_headers)

    response = client.get(
        f"/api/v1/knowledge/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == created["id"]


def test_get_missing_knowledge(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test retrieving a missing knowledge base."""
    response = client.get(
        f"/api/v1/knowledge/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_knowledge_isolated_from_other_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
) -> None:
    """Test a knowledge base cannot be fetched from another organization."""
    created = _create_knowledge(client, auth_headers)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        f"/api/v1/knowledge/{created['id']}",
        headers=other_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_private_knowledge_rejects_teammate(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    organization: Organization,
) -> None:
    """Test a private knowledge base cannot be fetched by a teammate."""
    created = _create_knowledge(client, auth_headers, name="Private KB")

    _teammate, teammate_headers = _create_teammate(db_session, client, organization)

    response = client.get(
        f"/api/v1/knowledge/{created['id']}",
        headers=teammate_headers,
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_get_organization_visible_knowledge_allows_teammate(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    organization: Organization,
) -> None:
    """Test an organization-visible knowledge base is readable by a teammate."""
    created = _create_knowledge(
        client,
        auth_headers,
        name="Shared KB",
        visibility="organization",
    )

    _teammate, teammate_headers = _create_teammate(db_session, client, organization)

    response = client.get(
        f"/api/v1/knowledge/{created['id']}",
        headers=teammate_headers,
    )

    assert response.status_code == status.HTTP_200_OK


def test_update_knowledge(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test updating a knowledge base."""
    created = _create_knowledge(client, auth_headers)

    response = client.patch(
        f"/api/v1/knowledge/{created['id']}",
        json={"name": "Updated Name"},
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["name"] == "Updated Name"


def test_update_missing_knowledge(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test updating a missing knowledge base."""
    response = client.patch(
        f"/api/v1/knowledge/{uuid4()}",
        json={"name": "Updated"},
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_knowledge_rejects_teammate(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    organization: Organization,
) -> None:
    """Test only the creator may update a knowledge base."""
    created = _create_knowledge(
        client,
        auth_headers,
        name="Shared KB",
        visibility="organization",
    )

    _teammate, teammate_headers = _create_teammate(db_session, client, organization)

    response = client.patch(
        f"/api/v1/knowledge/{created['id']}",
        json={"name": "Hijacked"},
        headers=teammate_headers,
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_delete_knowledge(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test deleting a knowledge base."""
    created = _create_knowledge(client, auth_headers)

    response = client.delete(
        f"/api/v1/knowledge/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT

    follow_up = client.get(
        f"/api/v1/knowledge/{created['id']}",
        headers=auth_headers,
    )

    assert follow_up.status_code == status.HTTP_404_NOT_FOUND


def test_delete_missing_knowledge(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test deleting a missing knowledge base."""
    response = client.delete(
        f"/api/v1/knowledge/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_knowledge_rejects_teammate(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    organization: Organization,
) -> None:
    """Test only the creator may delete a knowledge base."""
    created = _create_knowledge(
        client,
        auth_headers,
        name="Shared KB",
        visibility="organization",
    )

    _teammate, teammate_headers = _create_teammate(db_session, client, organization)

    response = client.delete(
        f"/api/v1/knowledge/{created['id']}",
        headers=teammate_headers,
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
