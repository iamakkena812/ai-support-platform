"""Tests for the AI Documents repository."""

from __future__ import annotations

from uuid import uuid4

from app.ai.documents.models import Document
from app.ai.documents.repository import DocumentRepository
from app.ai.knowledge.models import KnowledgeBase
from app.models.organization import Organization


def _build_document(
    organization_id: object,
    knowledge_id: object,
    **overrides: object,
) -> Document:
    """Build an unpersisted document for testing."""
    data: dict[str, object] = {
        "organization_id": organization_id,
        "knowledge_id": knowledge_id,
        "filename": "document.pdf",
        "original_filename": "document.pdf",
        "content_type": "application/pdf",
        "file_size": 1024,
        "storage_path": "/tmp/document.pdf",
        "checksum": "checksum-123",
        "version": 1,
        "status": "registered",
        "chunk_count": 0,
        "embedding_count": 0,
        "metadata_json": {"source": "unit-test"},
    }
    data.update(overrides)

    return Document(**data)


def test_create_document(
    document_repository: DocumentRepository,
    organization: Organization,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test creating a document."""
    document = _build_document(organization.id, knowledge_base.id)

    result = document_repository.create(document)

    assert result.id is not None
    assert result.filename == "document.pdf"
    assert result.status == "registered"


def test_get_document_scoped_to_organization(
    document_repository: DocumentRepository,
    organization: Organization,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test retrieving a document within its own organization."""
    document = document_repository.create(
        _build_document(organization.id, knowledge_base.id),
    )

    result = document_repository.get(document.id, organization.id)

    assert result is not None
    assert result.id == document.id
    assert result.filename == document.filename


def test_get_document_missing_returns_none(
    document_repository: DocumentRepository,
    organization: Organization,
) -> None:
    """Test retrieving a missing document."""
    result = document_repository.get(uuid4(), organization.id)

    assert result is None


def test_get_document_isolated_from_other_organization(
    document_repository: DocumentRepository,
    organization: Organization,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test a document is not visible from another organization."""
    document = document_repository.create(
        _build_document(organization.id, knowledge_base.id),
    )

    result = document_repository.get(document.id, uuid4())

    assert result is None


def test_list_documents_scoped_to_organization(
    document_repository: DocumentRepository,
    organization: Organization,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test listing documents only returns the caller's organization."""
    document_repository.create(_build_document(organization.id, knowledge_base.id))
    document_repository.create(_build_document(organization.id, knowledge_base.id))
    document_repository.create(_build_document(uuid4(), uuid4()))

    results = document_repository.list(organization.id)

    assert len(results) == 2
    assert all(doc.organization_id == organization.id for doc in results)


def test_list_documents_with_limit(
    document_repository: DocumentRepository,
    organization: Organization,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test listing documents with limit."""
    for _ in range(5):
        document_repository.create(_build_document(organization.id, knowledge_base.id))

    results = document_repository.list(
        organization.id,
        offset=0,
        limit=2,
    )

    assert len(results) == 2


def test_update_document(
    document_repository: DocumentRepository,
    organization: Organization,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test updating a document."""
    document = document_repository.create(
        _build_document(organization.id, knowledge_base.id),
    )

    document.status = "indexed"
    document.chunk_count = 25

    updated = document_repository.update(document)

    assert updated.status == "indexed"
    assert updated.chunk_count == 25


def test_delete_document(
    document_repository: DocumentRepository,
    organization: Organization,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test deleting a document."""
    document = document_repository.create(
        _build_document(organization.id, knowledge_base.id),
    )

    document_repository.delete(document)

    assert document_repository.get(document.id, organization.id) is None


def test_count_documents_scoped_to_organization(
    document_repository: DocumentRepository,
    organization: Organization,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test counting documents is scoped to organization."""
    document_repository.create(_build_document(organization.id, knowledge_base.id))
    document_repository.create(_build_document(organization.id, knowledge_base.id))
    document_repository.create(_build_document(uuid4(), uuid4()))

    assert document_repository.count(organization.id) == 2


def test_statistics_scoped_to_organization(
    document_repository: DocumentRepository,
    organization: Organization,
    knowledge_base: KnowledgeBase,
) -> None:
    """Test repository statistics are scoped to organization."""
    indexed = _build_document(organization.id, knowledge_base.id, status="indexed")
    failed = _build_document(organization.id, knowledge_base.id, status="failed")
    deleted = _build_document(organization.id, knowledge_base.id, status="deleted")
    other_org_indexed = _build_document(uuid4(), uuid4(), status="indexed")

    document_repository.create(indexed)
    document_repository.create(failed)
    document_repository.create(deleted)
    document_repository.create(other_org_indexed)

    statistics = document_repository.statistics(organization.id)

    assert statistics["total_documents"] == 3
    assert statistics["indexed_documents"] == 1
    assert statistics["failed_documents"] == 1
    assert statistics["deleted_documents"] == 1


def test_empty_statistics(
    document_repository: DocumentRepository,
    organization: Organization,
) -> None:
    """Test statistics structure for an organization with no documents."""
    statistics = document_repository.statistics(organization.id)

    assert statistics == {
        "total_documents": 0,
        "indexed_documents": 0,
        "failed_documents": 0,
        "deleted_documents": 0,
    }
