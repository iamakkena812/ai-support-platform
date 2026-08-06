"""FastAPI routes for the AI Embeddings module."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Query, Response, status

from app.ai.embeddings.dependencies import EmbeddingServiceDep
from app.ai.embeddings.schemas import (
    EmbeddingCreate,
    EmbeddingListResponse,
    EmbeddingResponse,
    EmbeddingUpdate,
)
from app.auth.dependencies import CurrentActiveUserDependency

router = APIRouter(
    prefix="/embeddings",
    tags=["AI Embeddings"],
)


@router.post(
    "",
    response_model=EmbeddingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_embedding(
    request: EmbeddingCreate,
    current_user: CurrentActiveUserDependency,
    service: EmbeddingServiceDep,
) -> EmbeddingResponse:
    """Create a new embedding.

    Args:
        request: Embedding creation request.
        current_user: Authenticated user.
        service: Embedding service.

    Returns:
        Created embedding.
    """
    return service.create(
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        request=request,
    )


@router.get(
    "",
    response_model=EmbeddingListResponse,
)
def list_embeddings(
    current_user: CurrentActiveUserDependency,
    service: EmbeddingServiceDep,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
) -> EmbeddingListResponse:
    """List embeddings.

    Args:
        current_user: Authenticated user.
        service: Embedding service.
        offset: Pagination offset.
        limit: Maximum number of items.

    Returns:
        Paginated embedding list.
    """
    return service.list_embeddings(
        organization_id=current_user.organization_id,
        offset=offset,
        limit=limit,
    )


@router.get(
    "/{embedding_id}",
    response_model=EmbeddingResponse,
)
def get_embedding(
    embedding_id: UUID,
    current_user: CurrentActiveUserDependency,
    service: EmbeddingServiceDep,
) -> EmbeddingResponse:
    """Retrieve an embedding.

    Args:
        embedding_id: Embedding identifier.
        current_user: Authenticated user.
        service: Embedding service.

    Returns:
        Requested embedding.
    """
    return service.get(
        embedding_id=embedding_id,
        organization_id=current_user.organization_id,
    )


@router.patch(
    "/{embedding_id}",
    response_model=EmbeddingResponse,
)
def update_embedding(
    embedding_id: UUID,
    request: EmbeddingUpdate,
    current_user: CurrentActiveUserDependency,
    service: EmbeddingServiceDep,
) -> EmbeddingResponse:
    """Update an embedding.

    Args:
        embedding_id: Embedding identifier.
        request: Update request.
        current_user: Authenticated user.
        service: Embedding service.

    Returns:
        Updated embedding.
    """
    return service.update(
        embedding_id=embedding_id,
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        request=request,
    )


@router.delete(
    "/{embedding_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_embedding(
    embedding_id: UUID,
    current_user: CurrentActiveUserDependency,
    service: EmbeddingServiceDep,
) -> Response:
    """Delete an embedding.

    Args:
        embedding_id: Embedding identifier.
        current_user: Authenticated user.
        service: Embedding service.

    Returns:
        Empty HTTP 204 response.
    """
    service.delete(
        embedding_id=embedding_id,
        organization_id=current_user.organization_id,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )
