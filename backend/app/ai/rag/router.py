"""API router for the AI RAG module."""

from __future__ import annotations

from fastapi import APIRouter, status

from app.ai.rag.dependencies import RAGServiceDep
from app.ai.rag.schemas import (
    ProviderListResponse,
    RAGRequest,
    RAGResponse,
    RAGStatisticsResponse,
)
from app.auth.dependencies import CurrentActiveUserDependency

router = APIRouter(
    prefix="/ai/rag",
    tags=["AI - RAG"],
)


@router.post(
    "/generate",
    response_model=RAGResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate an AI response",
)
def generate(
    request: RAGRequest,
    service: RAGServiceDep,
    current_user: CurrentActiveUserDependency,
) -> RAGResponse:
    """Generate an AI response using Retrieval-Augmented Generation.

    Args:
        request: RAG request.
        service: AI RAG service.
        current_user: Authenticated active user.

    Returns:
        Generated AI response.
    """
    return service.generate(request)


@router.get(
    "/providers",
    response_model=ProviderListResponse,
    status_code=status.HTTP_200_OK,
    summary="List supported LLM providers",
)
def providers(
    service: RAGServiceDep,
    current_user: CurrentActiveUserDependency,
) -> ProviderListResponse:
    """Return supported LLM providers.

    Args:
        service: AI RAG service.
        current_user: Authenticated active user.

    Returns:
        Supported LLM providers.
    """
    _ = current_user
    return service.providers()


@router.get(
    "/statistics",
    response_model=RAGStatisticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get RAG statistics",
)
def statistics(
    service: RAGServiceDep,
    current_user: CurrentActiveUserDependency,
) -> RAGStatisticsResponse:
    """Return AI RAG statistics.

    Args:
        service: AI RAG service.
        current_user: Authenticated active user.

    Returns:
        AI RAG statistics.
    """
    _ = current_user
    return service.statistics()
