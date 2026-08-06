"""Router providers for AI."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse

from app.ai.providers.dependencies import get_ai_service
from app.ai.providers.service import AIService
from app.ai.schemas import (
    AIConfiguration,
    AIHealth,
    AIRequest,
    AIResponse,
)

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post(
    "/chat",
    response_model=AIResponse,
    status_code=status.HTTP_200_OK,
)
def chat(
    request: AIRequest,
    service: Annotated[AIService, Depends(get_ai_service)],
) -> AIResponse:
    """Generate an AI chat response."""
    return service.generate(request)


@router.post(
    "/completion",
    response_model=AIResponse,
    status_code=status.HTTP_200_OK,
)
def completion(
    request: AIRequest,
    service: Annotated[AIService, Depends(get_ai_service)],
) -> AIResponse:
    """Generate an AI completion."""
    return service.generate(request)


@router.get(
    "/health",
    response_model=AIHealth,
)
def health(
    service: Annotated[AIService, Depends(get_ai_service)],
) -> AIHealth:
    """Return AI module health."""
    return service.health()


@router.get(
    "/configuration",
    response_model=AIConfiguration,
)
def configuration(
    service: Annotated[AIService, Depends(get_ai_service)],
) -> AIConfiguration:
    """Return AI configuration."""
    return service.configuration()


@router.post("/stream")
async def stream_ai(
    request: AIRequest,
    service: AIService = Depends(get_ai_service),
) -> StreamingResponse:
    """Stream AI responses."""
    return StreamingResponse(
        service.stream(request),
        media_type="text/event-stream",
    )
