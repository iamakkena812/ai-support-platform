"""Tests for the AI Documents router."""

from __future__ import annotations

from typing import cast
from uuid import uuid4

from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.ai.knowledge.models import KnowledgeBase
from app.auth.password import hash_password
from app.models.organization import Organization
from app.models.user import User


def _document_payload(knowledge_id: object, **overrides: object) -> dict[str, object]:
    """Return a valid document payload."""
    payload: dict[str, object] = {
        "knowledge_id": str(knowledge_id),
        "filename": "document.pdf",
        "original_filename": "document.pdf",
        "content_type": "application/pdf",
        "file_size": 1024,
        "storage_path": "/documents/document.pdf",
        "checksum": "checksum123",
        "metadata": {
            "source": "unit-test",
        },
    }
    payload.update(overrides)

    return payload


def _create_document(
    client: TestClient,
    auth_headers: dict[str, str],
    knowledge_id: object,
    **overrides: object,
) -> dict[str, object]:
    """Register a document and return the response body."""
    response = client.post(
        "/api/v1/ai/documents",
        json=_document_payload(knowledge_id, **overrides),
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_201_CREATED

    return cast(dict[str, object], response.json())


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


def test_create_document(
    client: TestClient,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test creating a document."""
    data = _create_document(client, auth_headers, knowledge_base.id)

    assert data["filename"] == "document.pdf"
    assert data["status"] == "registered"
    assert data["knowledge_id"] == str(knowledge_base.id)


def test_create_document_requires_authentication(
    client: TestClient,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test creating a document requires authentication."""
    response = client.post(
        "/api/v1/ai/documents",
        json=_document_payload(knowledge_base.id),
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_create_document_rejects_unknown_knowledge_base(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test creating a document against a nonexistent knowledge base fails."""
    response = client.post(
        "/api/v1/ai/documents",
        json=_document_payload(uuid4()),
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_create_document_rejects_other_organizations_knowledge_base(
    client: TestClient,
    db_session: Session,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test creating a document against another org's knowledge base fails."""
    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.post(
        "/api/v1/ai/documents",
        json=_document_payload(knowledge_base.id),
        headers=other_headers,
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_list_documents(
    client: TestClient,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test listing documents."""
    _create_document(client, auth_headers, knowledge_base.id)

    response = client.get(
        "/api/v1/ai/documents",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert "documents" in body
    assert "total" in body
    assert "page" in body
    assert "page_size" in body
    assert body["total"] >= 1


def test_list_documents_requires_authentication(
    client: TestClient,
) -> None:
    """Test authentication."""
    response = client.get("/api/v1/ai/documents")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_list_documents_isolated_from_other_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test documents are not visible across organizations."""
    _create_document(client, auth_headers, knowledge_base.id)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        "/api/v1/ai/documents",
        headers=other_headers,
    )

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert body["total"] == 0
    assert body["documents"] == []


def test_get_document(
    client: TestClient,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test retrieving a document."""
    created = _create_document(client, auth_headers, knowledge_base.id)

    response = client.get(
        f"/api/v1/ai/documents/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == created["id"]


def test_get_missing_document(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test retrieving a missing document."""
    response = client.get(
        f"/api/v1/ai/documents/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_document_isolated_from_other_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test a document cannot be fetched from another organization."""
    created = _create_document(client, auth_headers, knowledge_base.id)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        f"/api/v1/ai/documents/{created['id']}",
        headers=other_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_document(
    client: TestClient,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test updating a document."""
    created = _create_document(client, auth_headers, knowledge_base.id)

    response = client.patch(
        f"/api/v1/ai/documents/{created['id']}",
        json={
            "filename": "updated.pdf",
            "status": "indexed",
        },
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert body["filename"] == "updated.pdf"
    assert body["status"] == "indexed"


def test_update_missing_document(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test updating a missing document."""
    response = client.patch(
        f"/api/v1/ai/documents/{uuid4()}",
        json={"filename": "updated.pdf"},
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_document_isolated_from_other_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test a document cannot be updated from another organization."""
    created = _create_document(client, auth_headers, knowledge_base.id)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.patch(
        f"/api/v1/ai/documents/{created['id']}",
        json={"filename": "hijacked.pdf"},
        headers=other_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_document(
    client: TestClient,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test deleting a document."""
    created = _create_document(client, auth_headers, knowledge_base.id)

    response = client.delete(
        f"/api/v1/ai/documents/{created['id']}",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT

    follow_up = client.get(
        f"/api/v1/ai/documents/{created['id']}",
        headers=auth_headers,
    )

    assert follow_up.status_code == status.HTTP_404_NOT_FOUND


def test_delete_missing_document(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test deleting a missing document."""
    response = client.delete(
        f"/api/v1/ai/documents/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_document_isolated_from_other_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test a document cannot be deleted from another organization."""
    created = _create_document(client, auth_headers, knowledge_base.id)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.delete(
        f"/api/v1/ai/documents/{created['id']}",
        headers=other_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_document_statistics(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test document statistics."""
    response = client.get(
        "/api/v1/ai/documents/statistics",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert "total_documents" in body
    assert "indexed_documents" in body
    assert "failed_documents" in body
    assert "deleted_documents" in body


def test_document_statistics_requires_authentication(
    client: TestClient,
) -> None:
    """Test statistics requires authentication."""
    response = client.get("/api/v1/ai/documents/statistics")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_document_statistics_isolated_from_other_organizations(
    client: TestClient,
    db_session: Session,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test statistics only count the caller's organization."""
    _create_document(client, auth_headers, knowledge_base.id)

    _other_user, other_headers = _other_org_headers(client, db_session)

    response = client.get(
        "/api/v1/ai/documents/statistics",
        headers=other_headers,
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["total_documents"] == 0


def test_list_documents_pagination(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test pagination."""
    response = client.get(
        "/api/v1/ai/documents?page=1&page_size=5",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert body["page"] == 1
    assert body["page_size"] == 5


def test_invalid_uuid(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test invalid UUID."""
    response = client.get(
        "/api/v1/ai/documents/not-a-uuid",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_document_validation(
    client: TestClient,
    auth_headers: dict[str, str],
    knowledge_base: KnowledgeBase,
) -> None:
    """Test validation errors."""
    payload = _document_payload(knowledge_base.id)
    payload.pop("filename")

    response = client.post(
        "/api/v1/ai/documents",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
