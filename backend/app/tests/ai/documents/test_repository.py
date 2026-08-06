"""Tests for the AI Documents repository."""

from __future__ import annotations

from uuid import uuid4

from app.ai.documents.models import Document
from app.ai.documents.repository import DocumentRepository


def _create_document() -> Document:
    """Create a document for testing."""
    return Document(
        organization_id=uuid4(),
        knowledge_id=uuid4(),
        filename="document.pdf",
        original_filename="document.pdf",
        content_type="application/pdf",
        file_size=1024,
        storage_path="/tmp/document.pdf",
        checksum="checksum-123",
        version=1,
        status="registered",
        chunk_count=0,
        embedding_count=0,
        metadata_json={"source": "unit-test"},
    )


def test_create_document(
    document_repository: DocumentRepository,
) -> None:
    """Test creating a document."""
    document = _create_document()

    result = document_repository.create(document)

    assert result.id is not None
    assert result.filename == "document.pdf"
    assert result.status == "registered"


def test_get_document(
    document_repository: DocumentRepository,
) -> None:
    """Test retrieving a document."""
    document = document_repository.create(_create_document())

    result = document_repository.get(document.id)

    assert result is not None
    assert result.id == document.id
    assert result.filename == document.filename


def test_get_document_not_found(
    document_repository: DocumentRepository,
) -> None:
    """Test retrieving a missing document."""
    result = document_repository.get(uuid4())

    assert result is None


def test_list_documents(
    document_repository: DocumentRepository,
) -> None:
    """Test listing documents."""
    document_repository.create(_create_document())
    document_repository.create(_create_document())

    results = document_repository.list()

    assert len(results) >= 2


def test_list_documents_with_limit(
    document_repository: DocumentRepository,
) -> None:
    """Test listing documents with limit."""
    for _ in range(5):
        document_repository.create(_create_document())

    results = document_repository.list(
        offset=0,
        limit=2,
    )

    assert len(results) == 2


def test_update_document(
    document_repository: DocumentRepository,
) -> None:
    """Test updating a document."""
    document = document_repository.create(_create_document())

    document.status = "indexed"
    document.chunk_count = 25

    updated = document_repository.update(document)

    assert updated.status == "indexed"
    assert updated.chunk_count == 25


def test_delete_document(
    document_repository: DocumentRepository,
) -> None:
    """Test deleting a document."""
    document = document_repository.create(_create_document())

    document_repository.delete(document)

    assert document_repository.get(document.id) is None


def test_count_documents(
    document_repository: DocumentRepository,
) -> None:
    """Test counting documents."""
    initial = document_repository.count()

    document_repository.create(_create_document())
    document_repository.create(_create_document())

    assert document_repository.count() == initial + 2


def test_statistics(
    document_repository: DocumentRepository,
) -> None:
    """Test repository statistics."""
    indexed = _create_document()
    indexed.status = "indexed"

    failed = _create_document()
    failed.status = "failed"

    deleted = _create_document()
    deleted.status = "deleted"

    document_repository.create(indexed)
    document_repository.create(failed)
    document_repository.create(deleted)

    statistics = document_repository.statistics()

    assert statistics["total_documents"] >= 3
    assert statistics["indexed_documents"] >= 1
    assert statistics["failed_documents"] >= 1
    assert statistics["deleted_documents"] >= 1


def test_empty_statistics(
    document_repository: DocumentRepository,
) -> None:
    """Test statistics structure."""
    statistics = document_repository.statistics()

    assert "total_documents" in statistics
    assert "indexed_documents" in statistics
    assert "failed_documents" in statistics
    assert "deleted_documents" in statistics
