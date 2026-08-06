"""Service for the AI RAG module."""

from __future__ import annotations

from app.ai.rag.constants import (
    DEFAULT_MODEL,
    DEFAULT_PROVIDER,
)
from app.ai.rag.exceptions import (
    UnsupportedLLMProviderError,
)
from app.ai.rag.repository import RAGRepository
from app.ai.rag.schemas import (
    CitationResponse,
    ProviderListResponse,
    ProviderResponse,
    RAGRequest,
    RAGResponse,
    RAGStatisticsResponse,
    UsageResponse,
)


class RAGService:
    """Service for Retrieval-Augmented Generation."""

    def __init__(
        self,
        repository: RAGRepository,
    ) -> None:
        """Initialize the RAG service.

        Args:
            repository: RAG repository.
        """
        self._repository = repository

    def generate(
        self,
        request: RAGRequest,
    ) -> RAGResponse:
        """Generate an AI response."""
        self._validate_provider(
            request.provider,
        )

        embeddings = self._repository.list_embeddings(
            offset=0,
            limit=request.top_k,
        )

        citations = [
            CitationResponse(
                knowledge_id=embedding.knowledge_id,
                source_id=embedding.source_id,
                source_type=embedding.source_type.value,
                score=1.0,
            )
            for embedding in embeddings
        ]

        return RAGResponse(
            provider=request.provider,
            model=DEFAULT_MODEL,
            answer="This is a placeholder AI-generated response.",
            citations=citations,
            usage=UsageResponse(
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
            ),
            metadata={
                "retrieved_documents": len(embeddings),
            },
        )

    def providers(
        self,
    ) -> ProviderListResponse:
        """Return supported LLM providers."""
        return ProviderListResponse(
            providers=[
                ProviderResponse(
                    name=DEFAULT_PROVIDER,
                    display_name="OpenAI",
                    available=True,
                ),
            ],
        )

    def statistics(
        self,
    ) -> RAGStatisticsResponse:
        """Return RAG statistics."""
        return RAGStatisticsResponse(
            provider=DEFAULT_PROVIDER,
            total_requests=0,
            total_generations=self._repository.get_embedding_count(),
        )

    @staticmethod
    def _validate_provider(
        provider: str,
    ) -> None:
        """Validate the configured provider."""
        if provider != DEFAULT_PROVIDER:
            raise UnsupportedLLMProviderError(
                f"Unsupported provider: {provider}",
            )
