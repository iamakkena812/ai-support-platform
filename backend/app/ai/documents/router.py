"""Router for the AI Documents module."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.ai.documents.dependencies import DocumentServiceDep
from app.ai.documents.exceptions import DocumentNotFoundError
from app.ai.documents.schemas import (
    DocumentCreateRequest,
    DocumentListResponse,
    DocumentResponse,
    DocumentStatisticsResponse,
    DocumentUpdateRequest,
)
from app.auth.dependencies import CurrentActiveUserDependency

router = APIRouter(
    prefix="/ai/documents",
    tags=["AI - Documents"],
)


@router.post(
    "",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a document",
)
def create_document(
    request: DocumentCreateRequest,
    service: DocumentServiceDep,
    current_user: CurrentActiveUserDependency,
) -> DocumentResponse:
    """Register a new document.

    Args:
        request: Document creation request.
        service: Document service.
        current_user: Authenticated active user.

    Returns:
        Created document.
    """
    return service.create_document(
        request,
        organization_id=current_user.organization_id,
    )


@router.get(
    "",
    response_model=DocumentListResponse,
    summary="List documents",
)
def list_documents(
    service: DocumentServiceDep,
    current_user: CurrentActiveUserDependency,
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
) -> DocumentListResponse:
    """List documents.

    Args:
        service: Document service.
        current_user: Authenticated active user.
        page: Page number.
        page_size: Number of documents per page.

    Returns:
        Paginated documents.
    """
    _ = current_user

    return service.list_documents(
        page=page,
        page_size=page_size,
    )


@router.get(
    "/statistics",
    response_model=DocumentStatisticsResponse,
    summary="Document statistics",
)
def statistics(
    service: DocumentServiceDep,
    current_user: CurrentActiveUserDependency,
) -> DocumentStatisticsResponse:
    """Return document statistics.

    Args:
        service: Document service.
        current_user: Authenticated active user.

    Returns:
        Document statistics.
    """
    _ = current_user
    return service.statistics()


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
    summary="Get document",
)
def get_document(
    document_id: UUID,
    service: DocumentServiceDep,
    current_user: CurrentActiveUserDependency,
) -> DocumentResponse:
    """Return a document.

    Args:
        document_id: Document identifier.
        service: Document service.
        current_user: Authenticated active user.

    Returns:
        Document.

    Raises:
        HTTPException: If the document does not exist.
    """
    _ = current_user

    try:
        return service.get_document(document_id)
    except DocumentNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.patch(
    "/{document_id}",
    response_model=DocumentResponse,
    summary="Update document",
)
def update_document(
    document_id: UUID,
    request: DocumentUpdateRequest,
    service: DocumentServiceDep,
    current_user: CurrentActiveUserDependency,
) -> DocumentResponse:
    """Update a document.

    Args:
        document_id: Document identifier.
        request: Update request.
        service: Document service.
        current_user: Authenticated active user.

    Returns:
        Updated document.

    Raises:
        HTTPException: If the document does not exist.
    """
    _ = current_user

    try:
        return service.update_document(
            document_id,
            request,
        )
    except DocumentNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete document",
)
def delete_document(
    document_id: UUID,
    service: DocumentServiceDep,
    current_user: CurrentActiveUserDependency,
) -> None:
    """Delete a document.

    Args:
        document_id: Document identifier.
        service: Document service.
        current_user: Authenticated active user.

    Raises:
        HTTPException: If the document does not exist.
    """
    _ = current_user

    try:
        service.delete_document(document_id)
    except DocumentNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
