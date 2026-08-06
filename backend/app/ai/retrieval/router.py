"""Router for the AI Retrieval module."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.ai.retrieval.dependencies import RetrievalServiceDep
from app.ai.retrieval.exceptions import (
    UnsupportedRetrievalProviderError,
)
from app.ai.retrieval.schemas import (
    HybridRetrievalRequest,
    MetadataSearchRequest,
    ProviderListResponse,
    RetrievalRequest,
    RetrievalResponse,
    RetrievalStatisticsResponse,
)
from app.auth.dependencies import CurrentActiveUserDependency

router = APIRouter(
    prefix="/ai/retrieval",
    tags=["AI - Retrieval"],
)


@router.post(
    "/retrieve",
    response_model=RetrievalResponse,
    summary="Retrieve relevant documents",
)
def retrieve(
    request: RetrievalRequest,
    service: RetrievalServiceDep,
    current_user: CurrentActiveUserDependency,
) -> RetrievalResponse:
    """Retrieve relevant documents.

    Args:
        request: Retrieval request.
        service: Retrieval service.
        current_user: Authenticated active user.

    Returns:
        Retrieval response.
    """
    _ = current_user

    try:
        return service.retrieve(request)
    except UnsupportedRetrievalProviderError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post(
    "/hybrid",
    response_model=RetrievalResponse,
    summary="Hybrid document retrieval",
)
def hybrid(
    request: HybridRetrievalRequest,
    service: RetrievalServiceDep,
    current_user: CurrentActiveUserDependency,
) -> RetrievalResponse:
    """Perform hybrid retrieval.

    Args:
        request: Hybrid retrieval request.
        service: Retrieval service.
        current_user: Authenticated active user.

    Returns:
        Retrieval response.
    """
    _ = current_user

    try:
        return service.hybrid_retrieve(request)
    except UnsupportedRetrievalProviderError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post(
    "/metadata-search",
    response_model=RetrievalResponse,
    summary="Metadata search",
)
def metadata_search(
    request: MetadataSearchRequest,
    service: RetrievalServiceDep,
    current_user: CurrentActiveUserDependency,
) -> RetrievalResponse:
    """Search documents by metadata.

    Args:
        request: Metadata search request.
        service: Retrieval service.
        current_user: Authenticated active user.

    Returns:
        Retrieval response.
    """
    _ = current_user
    return service.metadata_search(request)


@router.get(
    "/providers",
    response_model=ProviderListResponse,
    summary="List retrieval providers",
)
def providers(
    service: RetrievalServiceDep,
    current_user: CurrentActiveUserDependency,
) -> ProviderListResponse:
    """List supported retrieval providers.

    Args:
        service: Retrieval service.
        current_user: Authenticated active user.

    Returns:
        Supported retrieval providers.
    """
    _ = current_user
    return service.providers()


@router.get(
    "/statistics",
    response_model=RetrievalStatisticsResponse,
    summary="Retrieval statistics",
)
def statistics(
    service: RetrievalServiceDep,
    current_user: CurrentActiveUserDependency,
) -> RetrievalStatisticsResponse:
    """Return retrieval statistics.

    Args:
        service: Retrieval service.
        current_user: Authenticated active user.

    Returns:
        Retrieval statistics.
    """
    _ = current_user
    return service.statistics()
