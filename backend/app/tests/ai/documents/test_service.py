"""Tests for the AI Documents service."""

from __future__ import annotations

from uuid import uuid4

import pytest

from app.ai.documents.exceptions import (
    DocumentNotFoundError,
    KnowledgeBaseNotFoundError,
)
from app.ai.documents.schemas import (
    DocumentCreateRequest,
    DocumentUpdateRequest,
)
from app.ai.documents.service import DocumentService
from app.ai.knowledge.models import KnowledgeBase
from app.models.organization import Organization
from app.models.user import User


def _create_request(knowledge_id: object, **overrides: object) -> DocumentCreateRequest:
    """Create a document request."""
    data: dict[str, object] = {
        "knowledge_id": knowledge_id,
        "filename": "document.pdf",
        "original_filename": "document.pdf",
        "content_type": "application/pdf",
        "file_size": 1024,
        "storage_path": "/documents/document.pdf",
        "checksum": "checksum123",
        "metadata": {"source": "unit-test"},
    }
    data.update(overrides)

    return DocumentCreateRequest(**data)  # type: ignore[arg-type]


def test_create_document(
    document_service: DocumentService,
    organization: Organization,
    knowledge_base: KnowledgeBase,
    user: User,
) -> None:
    """Test creating a document."""
    request = _create_request(knowledge_base.id)

    response = document_service.create_document(
        request,
        organization_id=organization.id,
        user_id=user.id,
    )

    assert response.filename == request.filename
    assert response.status == "registered"
    assert response.version == 1
    assert response.chunk_count == 0
    assert response.embedding_count == 0
    assert response.organization_id == organization.id


def test_create_document_rejects_unknown_knowledge_base(
    document_service: DocumentService,
    organization: Organization,
    user: User,
) -> None:
    """Test creating a document against a nonexistent knowledge base fails."""
    request = _create_request(uuid4())

    with pytest.raises(KnowledgeBaseNotFoundError):
        document_service.create_document(
            request,
            organization_id=organization.id,
            user_id=user.id,
        )


def test_create_document_rejects_other_organizations_knowledge_base(
    document_service: DocumentService,
    knowledge_base: KnowledgeBase,
    user: User,
) -> None:
    """Test a knowledge base from another organization cannot be referenced."""
    request = _create_request(knowledge_base.id)

    with pytest.raises(KnowledgeBaseNotFoundError):
        document_service.create_document(
            request,
            organization_id=uuid4(),
            user_id=user.id,
        )


def test_list_documents_scoped_to_organization(
    document_service: DocumentService,
    organization: Organization,
    knowledge_base: KnowledgeBase,
    user: User,
) -> None:
    """Test listing documents only returns the caller's organization."""
    for _ in range(3):
        document_service.create_document(
            _create_request(knowledge_base.id),
            organization_id=organization.id,
            user_id=user.id,
        )

    response = document_service.list_documents(organization_id=organization.id)

    assert response.total == 3
    assert len(response.documents) == 3

    other_org_response = document_service.list_documents(organization_id=uuid4())

    assert other_org_response.total == 0
    assert other_org_response.documents == []


def test_get_document(
    document_service: DocumentService,
    organization: Organization,
    knowledge_base: KnowledgeBase,
    user: User,
) -> None:
    """Test getting a document."""
    response = document_service.create_document(
        _create_request(knowledge_base.id),
        organization_id=organization.id,
        user_id=user.id,
    )

    document = document_service.get_document(
        response.id,
        organization_id=organization.id,
    )

    assert document.id == response.id
    assert document.filename == response.filename


def test_get_document_not_found(
    document_service: DocumentService,
    organization: Organization,
) -> None:
    """Test missing document."""
    with pytest.raises(DocumentNotFoundError):
        document_service.get_document(uuid4(), organization_id=organization.id)


def test_get_document_isolated_from_other_organization(
    document_service: DocumentService,
    organization: Organization,
    knowledge_base: KnowledgeBase,
    user: User,
) -> None:
    """Test a document cannot be fetched from another organization."""
    created = document_service.create_document(
        _create_request(knowledge_base.id),
        organization_id=organization.id,
        user_id=user.id,
    )

    with pytest.raises(DocumentNotFoundError):
        document_service.get_document(created.id, organization_id=uuid4())


def test_update_document(
    document_service: DocumentService,
    organization: Organization,
    knowledge_base: KnowledgeBase,
    user: User,
) -> None:
    """Test updating a document."""
    created = document_service.create_document(
        _create_request(knowledge_base.id),
        organization_id=organization.id,
        user_id=user.id,
    )

    request = DocumentUpdateRequest(
        filename="updated.pdf",
        status="indexed",
        metadata={"updated": True},
    )

    updated = document_service.update_document(
        created.id,
        request,
        organization_id=organization.id,
        user_id=user.id,
    )

    assert updated.filename == "updated.pdf"
    assert updated.status == "indexed"
    assert updated.metadata["updated"] is True


def test_update_missing_document(
    document_service: DocumentService,
    organization: Organization,
    user: User,
) -> None:
    """Test updating a missing document."""
    request = DocumentUpdateRequest(filename="updated.pdf")

    with pytest.raises(DocumentNotFoundError):
        document_service.update_document(
            uuid4(),
            request,
            organization_id=organization.id,
            user_id=user.id,
        )


def test_delete_document(
    document_service: DocumentService,
    organization: Organization,
    knowledge_base: KnowledgeBase,
    user: User,
) -> None:
    """Test deleting a document."""
    created = document_service.create_document(
        _create_request(knowledge_base.id),
        organization_id=organization.id,
        user_id=user.id,
    )

    document_service.delete_document(created.id, organization_id=organization.id)

    with pytest.raises(DocumentNotFoundError):
        document_service.get_document(created.id, organization_id=organization.id)


def test_delete_missing_document(
    document_service: DocumentService,
    organization: Organization,
) -> None:
    """Test deleting a missing document."""
    with pytest.raises(DocumentNotFoundError):
        document_service.delete_document(uuid4(), organization_id=organization.id)


def test_statistics(
    document_service: DocumentService,
    organization: Organization,
    knowledge_base: KnowledgeBase,
    user: User,
) -> None:
    """Test statistics."""
    for _ in range(5):
        document_service.create_document(
            _create_request(knowledge_base.id),
            organization_id=organization.id,
            user_id=user.id,
        )

    statistics = document_service.statistics(organization_id=organization.id)

    assert statistics.total_documents == 5
    assert statistics.indexed_documents == 0
    assert statistics.failed_documents == 0
    assert statistics.deleted_documents == 0


def test_build_response(
    document_service: DocumentService,
    organization: Organization,
    knowledge_base: KnowledgeBase,
    user: User,
) -> None:
    """Test response generation."""
    created = document_service.create_document(
        _create_request(knowledge_base.id),
        organization_id=organization.id,
        user_id=user.id,
    )

    assert created.id is not None
    assert created.organization_id == organization.id
    assert created.knowledge_id == knowledge_base.id
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
