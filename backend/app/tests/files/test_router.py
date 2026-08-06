"""File router tests."""

from __future__ import annotations

from typing import Any, cast
from uuid import uuid4

from fastapi.testclient import TestClient

from app.files.constants import (
    FileCategory,
    FileProvider,
    FileStatus,
)


def create_file(
    client: TestClient,
    auth_headers: dict[str, str],
) -> str:
    """Create a file and return its id."""
    response = client.post(
        "/api/v1/files",
        headers=auth_headers,
        json={
            "filename": "document.pdf",
            "original_filename": "document.pdf",
            "content": "ZXhhbXBsZQ==",
            "content_type": "application/pdf",
            "size": 7,
            "checksum": "abc123checksum",
            "provider": FileProvider.LOCAL.value,
            "category": FileCategory.DOCUMENT.value,
        },
    )

    assert response.status_code == 201

    body = cast(dict[str, Any], response.json())

    return str(body["id"])


def test_create_file(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Create a file."""
    response = client.post(
        "/api/v1/files",
        headers=auth_headers,
        json={
            "filename": "document.pdf",
            "original_filename": "document.pdf",
            "content": "ZXhhbXBsZQ==",
            "content_type": "application/pdf",
            "size": 7,
            "checksum": "abc123checksum",
            "provider": FileProvider.LOCAL.value,
            "category": FileCategory.DOCUMENT.value,
        },
    )

    assert response.status_code == 201

    body = response.json()

    assert body["filename"] == "document.pdf"
    assert body["content_type"] == "application/pdf"
    assert body["status"] == FileStatus.ACTIVE.value
    assert body["id"] is not None


def test_list_files(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """List files."""
    create_file(
        client,
        auth_headers,
    )

    response = client.get(
        "/api/v1/files",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] >= 1
    assert len(body["items"]) >= 1


def test_get_file(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Retrieve a file."""
    file_id = create_file(
        client,
        auth_headers,
    )

    response = client.get(
        f"/api/v1/files/{file_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert body["id"] == file_id
    assert body["filename"] == "document.pdf"


def test_get_missing_file(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Return 404 for missing file."""
    response = client.get(
        f"/api/v1/files/{uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_update_file(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Update a file."""
    file_id = create_file(
        client,
        auth_headers,
    )

    response = client.patch(
        f"/api/v1/files/{file_id}",
        headers=auth_headers,
        json={
            "filename": "updated.pdf",
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["filename"] == "updated.pdf"


def test_search_files(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Search files."""
    create_file(
        client,
        auth_headers,
    )

    response = client.get(
        "/api/v1/files/search",
        headers=auth_headers,
        params={
            "status": FileStatus.ACTIVE.value,
        },
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_file(
    client: TestClient,
    auth_headers: dict[str, str],
) -> None:
    """Delete a file."""
    file_id = create_file(
        client,
        auth_headers,
    )

    response = client.delete(
        f"/api/v1/files/{file_id}",
        headers=auth_headers,
    )

    assert response.status_code == 204

    response = client.get(
        f"/api/v1/files/{file_id}",
        headers=auth_headers,
    )

    assert response.status_code == 404
