"""Router for AI Vector Store operations."""

from __future__ import annotations

from fastapi import APIRouter, status

from app.ai.vectorstore.dependencies import VectorStoreServiceDep
from app.ai.vectorstore.schemas import (
    HybridSearchRequest,
    ProviderListResponse,
    SemanticSearchRequest,
    SimilarEmbeddingsRequest,
    VectorSearchResponse,
    VectorStoreStatisticsResponse,
)
from app.auth.dependencies import CurrentActiveUserDependency

router = APIRouter(
    prefix="/vectorstore",
    tags=["AI Vector Store"],
)


@router.post(
    "/search",
    response_model=VectorSearchResponse,
    status_code=status.HTTP_200_OK,
)
def semantic_search(
    request: SemanticSearchRequest,
    service: VectorStoreServiceDep,
    _: CurrentActiveUserDependency,
) -> VectorSearchResponse:
    """Perform semantic vector search.

    Args:
        request: Search request.
        service: Vector Store service.
        _: Authenticated user.

    Returns:
        Search results.
    """
    return service.semantic_search(request)


@router.post(
    "/similar",
    response_model=VectorSearchResponse,
    status_code=status.HTTP_200_OK,
)
def similar_embeddings(
    request: SimilarEmbeddingsRequest,
    service: VectorStoreServiceDep,
    _: CurrentActiveUserDependency,
) -> VectorSearchResponse:
    """Find embeddings similar to an existing embedding.

    Args:
        request: Similar embeddings request.
        service: Vector Store service.
        _: Authenticated user.

    Returns:
        Similar embeddings.
    """
    return service.similar_embeddings(request)


@router.post(
    "/hybrid",
    response_model=VectorSearchResponse,
    status_code=status.HTTP_200_OK,
)
def hybrid_search(
    request: HybridSearchRequest,
    service: VectorStoreServiceDep,
    _: CurrentActiveUserDependency,
) -> VectorSearchResponse:
    """Perform hybrid keyword and vector search.

    Args:
        request: Hybrid search request.
        service: Vector Store service.
        _: Authenticated user.

    Returns:
        Search results.
    """
    return service.hybrid_search(request)


@router.get(
    "/providers",
    response_model=ProviderListResponse,
    status_code=status.HTTP_200_OK,
)
def list_providers(
    service: VectorStoreServiceDep,
    _: CurrentActiveUserDependency,
) -> ProviderListResponse:
    """Return supported vector providers.

    Args:
        service: Vector Store service.
        _: Authenticated user.

    Returns:
        Supported vector providers.
    """
    return service.providers()


@router.get(
    "/statistics",
    response_model=VectorStoreStatisticsResponse,
    status_code=status.HTTP_200_OK,
)
def statistics(
    service: VectorStoreServiceDep,
    _: CurrentActiveUserDependency,
) -> VectorStoreStatisticsResponse:
    """Return Vector Store statistics.

    Args:
        service: Vector Store service.
        _: Authenticated user.

    Returns:
        Vector Store statistics.
    """
    return service.statistics()
