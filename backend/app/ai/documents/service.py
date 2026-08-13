"""Service for the AI Documents module."""

from __future__ import annotations

from uuid import UUID

from app.ai.documents.constants import DEFAULT_DOCUMENT_VERSION
from app.ai.documents.exceptions import (
    DocumentNotFoundError,
    KnowledgeBaseNotFoundError,
)
from app.ai.documents.models import Document
from app.ai.documents.repository import DocumentRepository
from app.ai.documents.schemas import (
    DocumentCreateRequest,
    DocumentListResponse,
    DocumentResponse,
    DocumentStatisticsResponse,
    DocumentUpdateRequest,
)
from app.ai.knowledge.repository import AIKnowledgeRepository


class DocumentService:
    """Service for document operations."""

    def __init__(
        self,
        repository: DocumentRepository,
        knowledge_repository: AIKnowledgeRepository,
    ) -> None:
        """Initialize the document service.

        Args:
            repository: Document repository.
            knowledge_repository: Knowledge base repository, used to
                validate that a document's parent knowledge base exists
                within the caller's organization.
        """
        self._repository = repository
        self._knowledge_repository = knowledge_repository

    def create_document(
        self,
        request: DocumentCreateRequest,
        *,
        organization_id: UUID,
        user_id: UUID,
    ) -> DocumentResponse:
        """Create a document.

        Args:
            request: Document creation request.
            organization_id: Organization identifier.
            user_id: Identifier of the user registering the document.

        Returns:
            Created document.

        Raises:
            KnowledgeBaseNotFoundError: If the referenced knowledge base
                does not exist in the caller's organization.
        """
        knowledge_base = self._knowledge_repository.get_by_id(
            request.knowledge_id,
            organization_id,
        )

        if knowledge_base is None:
            raise KnowledgeBaseNotFoundError(str(request.knowledge_id))

        document = Document(
            organization_id=organization_id,
            knowledge_id=request.knowledge_id,
            filename=request.filename,
            original_filename=request.original_filename,
            content_type=request.content_type,
            file_size=request.file_size,
            storage_path=request.storage_path,
            checksum=request.checksum,
            version=DEFAULT_DOCUMENT_VERSION,
            status="registered",
            chunk_count=0,
            embedding_count=0,
            metadata_json=request.metadata,
            created_by=user_id,
            updated_by=user_id,
        )

        document = self._repository.create(document)

        return self._build_response(document)

    def list_documents(
        self,
        *,
        organization_id: UUID,
        page: int = 1,
        page_size: int = 20,
    ) -> DocumentListResponse:
        """List documents belonging to an organization.

        Args:
            organization_id: Organization identifier.
            page: Page number.
            page_size: Page size.

        Returns:
            Paginated documents.
        """
        offset = (page - 1) * page_size

        documents = self._repository.list(
            organization_id,
            offset=offset,
            limit=page_size,
        )

        total = self._repository.count(organization_id)

        return DocumentListResponse(
            documents=[self._build_response(document) for document in documents],
            total=total,
            page=page,
            page_size=page_size,
        )

    def get_document(
        self,
        document_id: UUID,
        *,
        organization_id: UUID,
    ) -> DocumentResponse:
        """Return a document scoped to an organization.

        Args:
            document_id: Document identifier.
            organization_id: Organization identifier.

        Returns:
            Document.

        Raises:
            DocumentNotFoundError: If the document does not exist.
        """
        document = self._repository.get(document_id, organization_id)

        if document is None:
            raise DocumentNotFoundError(str(document_id))

        return self._build_response(document)

    def update_document(
        self,
        document_id: UUID,
        request: DocumentUpdateRequest,
        *,
        organization_id: UUID,
        user_id: UUID,
    ) -> DocumentResponse:
        """Update a document.

        Args:
            document_id: Document identifier.
            request: Update request.
            organization_id: Organization identifier.
            user_id: Identifier of the user performing the update.

        Returns:
            Updated document.

        Raises:
            DocumentNotFoundError: If the document does not exist.
        """
        document = self._repository.get(document_id, organization_id)

        if document is None:
            raise DocumentNotFoundError(str(document_id))

        if request.filename is not None:
            document.filename = request.filename

        if request.status is not None:
            document.status = request.status

        if request.metadata is not None:
            document.metadata_json = request.metadata

        document.updated_by = user_id

        document = self._repository.update(document)

        return self._build_response(document)

    def delete_document(
        self,
        document_id: UUID,
        *,
        organization_id: UUID,
    ) -> None:
        """Delete a document.

        Args:
            document_id: Document identifier.
            organization_id: Organization identifier.

        Raises:
            DocumentNotFoundError: If the document does not exist.
        """
        document = self._repository.get(document_id, organization_id)

        if document is None:
            raise DocumentNotFoundError(str(document_id))

        self._repository.delete(document)

    def statistics(
        self,
        *,
        organization_id: UUID,
    ) -> DocumentStatisticsResponse:
        """Return document statistics for an organization.

        Args:
            organization_id: Organization identifier.

        Returns:
            Document statistics.
        """
        statistics = self._repository.statistics(organization_id)

        return DocumentStatisticsResponse(
            total_documents=statistics["total_documents"],
            indexed_documents=statistics["indexed_documents"],
            failed_documents=statistics["failed_documents"],
            deleted_documents=statistics["deleted_documents"],
        )

    @staticmethod
    def _build_response(
        document: Document,
    ) -> DocumentResponse:
        """Build a document response.

        Args:
            document: Document model.

        Returns:
            Document response.
        """
        return DocumentResponse(
            id=document.id,
            organization_id=document.organization_id,
            knowledge_id=document.knowledge_id,
            filename=document.filename,
            original_filename=document.original_filename,
            content_type=document.content_type,
            file_size=document.file_size,
            storage_path=document.storage_path,
            checksum=document.checksum,
            version=document.version,
            status=document.status,
            chunk_count=document.chunk_count,
            embedding_count=document.embedding_count,
            metadata=document.metadata_json,
            created_at=document.created_at,
            updated_at=document.updated_at,
        )
