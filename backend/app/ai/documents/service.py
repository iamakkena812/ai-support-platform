"""Service for the AI Documents module."""

from __future__ import annotations

from uuid import UUID

from app.ai.documents.constants import DEFAULT_DOCUMENT_VERSION
from app.ai.documents.exceptions import DocumentNotFoundError
from app.ai.documents.models import Document
from app.ai.documents.repository import DocumentRepository
from app.ai.documents.schemas import (
    DocumentCreateRequest,
    DocumentListResponse,
    DocumentResponse,
    DocumentStatisticsResponse,
    DocumentUpdateRequest,
)


class DocumentService:
    """Service for document operations."""

    def __init__(
        self,
        repository: DocumentRepository,
    ) -> None:
        """Initialize the document service.

        Args:
            repository: Document repository.
        """
        self._repository = repository

    def create_document(
        self,
        request: DocumentCreateRequest,
        *,
        organization_id: UUID,
    ) -> DocumentResponse:
        """Create a document.

        Args:
            request: Document creation request.
            organization_id: Organization identifier.

        Returns:
            Created document.
        """
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
        )

        document = self._repository.create(document)

        return self._build_response(document)

    def list_documents(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
    ) -> DocumentListResponse:
        """List documents.

        Args:
            page: Page number.
            page_size: Page size.

        Returns:
            Paginated documents.
        """
        offset = (page - 1) * page_size

        documents = self._repository.list(
            offset=offset,
            limit=page_size,
        )

        total = self._repository.count()

        return DocumentListResponse(
            documents=[self._build_response(document) for document in documents],
            total=total,
            page=page,
            page_size=page_size,
        )

    def get_document(
        self,
        document_id: UUID,
    ) -> DocumentResponse:
        """Return a document.

        Args:
            document_id: Document identifier.

        Returns:
            Document.

        Raises:
            DocumentNotFoundError: If the document does not exist.
        """
        document = self._repository.get(document_id)

        if document is None:
            raise DocumentNotFoundError(
                f"Document {document_id} not found.",
            )

        return self._build_response(document)

    def update_document(
        self,
        document_id: UUID,
        request: DocumentUpdateRequest,
    ) -> DocumentResponse:
        """Update a document.

        Args:
            document_id: Document identifier.
            request: Update request.

        Returns:
            Updated document.
        """
        document = self._repository.get(document_id)

        if document is None:
            raise DocumentNotFoundError(
                f"Document {document_id} not found.",
            )

        if request.filename is not None:
            document.filename = request.filename

        if request.status is not None:
            document.status = request.status

        if request.metadata is not None:
            document.metadata_json = request.metadata

        document = self._repository.update(document)

        return self._build_response(document)

    def delete_document(
        self,
        document_id: UUID,
    ) -> None:
        """Delete a document.

        Args:
            document_id: Document identifier.

        Raises:
            DocumentNotFoundError: If the document does not exist.
        """
        document = self._repository.get(document_id)

        if document is None:
            raise DocumentNotFoundError(
                f"Document {document_id} not found.",
            )

        self._repository.delete(document)

    def statistics(
        self,
    ) -> DocumentStatisticsResponse:
        """Return document statistics.

        Returns:
            Document statistics.
        """
        statistics = self._repository.statistics()

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
