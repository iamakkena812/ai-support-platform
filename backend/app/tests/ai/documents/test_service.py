"""Tests for the AI Documents service."""

from __future__ import annotations

from uuid import uuid4

import pytest

from app.ai.documents.exceptions import DocumentNotFoundError
from app.ai.documents.models import Document
from app.ai.documents.schemas import (
    DocumentCreateRequest,
    DocumentUpdateRequest,
)
from app.ai.documents.service import DocumentService


def _create_request() -> DocumentCreateRequest:
    """Create a document request."""
    return DocumentCreateRequest(
        knowledge_id=uuid4(),
        filename="document.pdf",
        original_filename="document.pdf",
        content_type="application/pdf",
        file_size=1024,
        storage_path="/documents/document.pdf",
        checksum="checksum123",
        metadata={"source": "unit-test"},
    )


def _create_document() -> Document:
    """Create a document model."""
    return Document(
        organization_id=uuid4(),
        knowledge_id=uuid4(),
        filename="document.pdf",
        original_filename="document.pdf",
        content_type="application/pdf",
        file_size=1024,
        storage_path="/documents/document.pdf",
        checksum="checksum123",
        version=1,
        status="registered",
        chunk_count=0,
        embedding_count=0,
        metadata_json={"source": "unit-test"},
    )


def test_create_document(
    document_service: DocumentService,
) -> None:
    """Test creating a document."""
    request = _create_request()

    response = document_service.create_document(
        request,
        organization_id=uuid4(),
    )

    assert response.filename == request.filename
    assert response.status == "registered"
    assert response.version == 1
    assert response.chunk_count == 0
    assert response.embedding_count == 0


def test_list_documents(
    document_service: DocumentService,
) -> None:
    """Test listing documents."""
    organization_id = uuid4()

    for _ in range(3):
        document_service.create_document(
            _create_request(),
            organization_id=organization_id,
        )

    response = document_service.list_documents()

    assert response.total >= 3
    assert len(response.documents) >= 3


def test_get_document(
    document_service: DocumentService,
) -> None:
    """Test getting a document."""
    response = document_service.create_document(
        _create_request(),
        organization_id=uuid4(),
    )

    document = document_service.get_document(
        response.id,
    )

    assert document.id == response.id
    assert document.filename == response.filename


def test_get_document_not_found(
    document_service: DocumentService,
) -> None:
    """Test missing document."""
    with pytest.raises(DocumentNotFoundError):
        document_service.get_document(uuid4())


def test_update_document(
    document_service: DocumentService,
) -> None:
    """Test updating a document."""
    created = document_service.create_document(
        _create_request(),
        organization_id=uuid4(),
    )

    request = DocumentUpdateRequest(
        filename="updated.pdf",
        status="indexed",
        metadata={"updated": True},
    )

    updated = document_service.update_document(
        created.id,
        request,
    )

    assert updated.filename == "updated.pdf"
    assert updated.status == "indexed"
    assert updated.metadata["updated"] is True


def test_update_missing_document(
    document_service: DocumentService,
) -> None:
    """Test updating a missing document."""
    request = DocumentUpdateRequest(
        filename="updated.pdf",
    )

    with pytest.raises(DocumentNotFoundError):
        document_service.update_document(
            uuid4(),
            request,
        )


def test_delete_document(
    document_service: DocumentService,
) -> None:
    """Test deleting a document."""
    created = document_service.create_document(
        _create_request(),
        organization_id=uuid4(),
    )

    document_service.delete_document(
        created.id,
    )

    with pytest.raises(DocumentNotFoundError):
        document_service.get_document(
            created.id,
        )


def test_delete_missing_document(
    document_service: DocumentService,
) -> None:
    """Test deleting a missing document."""
    with pytest.raises(DocumentNotFoundError):
        document_service.delete_document(
            uuid4(),
        )


def test_statistics(
    document_service: DocumentService,
) -> None:
    """Test statistics."""
    organization_id = uuid4()

    for _ in range(5):
        document_service.create_document(
            _create_request(),
            organization_id=organization_id,
        )

    statistics = document_service.statistics()

    assert statistics.total_documents >= 5
    assert statistics.indexed_documents >= 0
    assert statistics.failed_documents >= 0
    assert statistics.deleted_documents >= 0


def test_build_response(
    document_service: DocumentService,
) -> None:
    """Test response generation."""
    created = document_service.create_document(
        _create_request(),
        organization_id=uuid4(),
    )

    assert created.id is not None
    assert created.organization_id is not None
    assert created.knowledge_id is not None
    assert created.filename == "document.pdf"
    assert created.original_filename == "document.pdf"
    assert created.content_type == "application/pdf"
    assert created.file_size == 1024
    assert created.storage_path == "/documents/document.pdf"
    assert created.checksum == "checksum123"
    assert created.version == 1
    assert created.status == "registered"
    assert created.chunk_count == 0
    assert created.embedding_count == 0
