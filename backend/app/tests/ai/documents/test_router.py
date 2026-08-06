"""Tests for the AI Documents router."""

from __future__ import annotations

from uuid import uuid4

from fastapi import status
from fastapi.testclient import TestClient


def _document_payload() -> dict[str, object]:
    """Return a valid document payload."""
    return {
        "knowledge_id": str(uuid4()),
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


def test_create_document(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test creating a document."""
    response = client.post(
        "/api/v1/ai/documents",
        json=_document_payload(),
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_201_CREATED

    data = response.json()

    assert data["filename"] == "document.pdf"
    assert data["status"] == "registered"


def test_list_documents(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test listing documents."""
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


def test_get_document(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test retrieving a document."""
    create = client.post(
        "/api/v1/ai/documents",
        json=_document_payload(),
        headers=auth_headers,
    )

    document_id = create.json()["id"]

    response = client.get(
        f"/api/v1/ai/documents/{document_id}",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_200_OK

    assert response.json()["id"] == document_id


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


def test_update_document(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test updating a document."""
    create = client.post(
        "/api/v1/ai/documents",
        json=_document_payload(),
        headers=auth_headers,
    )

    document_id = create.json()["id"]

    response = client.patch(
        f"/api/v1/ai/documents/{document_id}",
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
        json={
            "filename": "updated.pdf",
        },
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_document(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Test deleting a document."""
    create = client.post(
        "/api/v1/ai/documents",
        json=_document_payload(),
        headers=auth_headers,
    )

    document_id = create.json()["id"]

    response = client.delete(
        f"/api/v1/ai/documents/{document_id}",
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT


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
) -> None:
    """Test validation errors."""
    payload = _document_payload()
    payload.pop("filename")

    response = client.post(
        "/api/v1/ai/documents",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_requires_authentication(
    client: TestClient,
) -> None:
    """Test authentication."""
    response = client.get(
        "/api/v1/ai/documents",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
