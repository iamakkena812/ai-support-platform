"""Service for AI Vector Store operations."""

from __future__ import annotations

from collections.abc import Sequence

from app.ai.embeddings.models import Embedding
from app.ai.vectorstore.constants import DEFAULT_PROVIDER
from app.ai.vectorstore.exceptions import (
    EmbeddingNotFoundError,
    UnsupportedProviderError,
)
from app.ai.vectorstore.repository import VectorStoreRepository
from app.ai.vectorstore.schemas import (
    HybridSearchRequest,
    ProviderListResponse,
    ProviderResponse,
    SemanticSearchRequest,
    SimilarEmbeddingsRequest,
    VectorSearchResponse,
    VectorSearchResult,
    VectorStoreStatisticsResponse,
)


class VectorStoreService:
    """Service for vector store operations."""

    def __init__(
        self,
        repository: VectorStoreRepository,
    ) -> None:
        """Initialize the service.

        Args:
            repository: Vector store repository.
        """
        self._repository = repository

    def semantic_search(
        self,
        request: SemanticSearchRequest,
    ) -> VectorSearchResponse:
        """Perform semantic vector search."""
        self._validate_provider(request.provider)

        embeddings = self._repository.search(
            offset=0,
            limit=request.top_k,
        )

        return self._build_response(
            provider=request.provider,
            embeddings=embeddings,
        )

    def similar_embeddings(
        self,
        request: SimilarEmbeddingsRequest,
    ) -> VectorSearchResponse:
        """Find similar embeddings."""
        self._validate_provider(request.provider)

        embedding = self._repository.get(request.embedding_id)

        if embedding is None:
            raise EmbeddingNotFoundError(
                "Embedding not found.",
            )

        embeddings = self._repository.top_k(
            k=request.top_k,
        )

        return self._build_response(
            provider=request.provider,
            embeddings=embeddings,
        )

    def hybrid_search(
        self,
        request: HybridSearchRequest,
    ) -> VectorSearchResponse:
        """Perform hybrid search."""
        self._validate_provider(request.provider)

        embeddings = self._repository.search(
            offset=0,
            limit=request.top_k,
        )

        return self._build_response(
            provider=request.provider,
            embeddings=embeddings,
        )

    def providers(self) -> ProviderListResponse:
        """Return supported vector providers."""
        providers = [
            ProviderResponse(
                name=DEFAULT_PROVIDER,
                display_name="OpenAI",
                supports_semantic_search=True,
                supports_similarity_search=True,
                supports_hybrid_search=True,
                supports_metadata_filtering=True,
                supports_updates=False,
                supports_deletion=False,
                available=True,
            ),
        ]

        return ProviderListResponse(
            providers=providers,
        )

    def statistics(
        self,
    ) -> VectorStoreStatisticsResponse:
        """Return vector store statistics."""
        return VectorStoreStatisticsResponse(
            provider=DEFAULT_PROVIDER,
            total_embeddings=self._repository.count(),
            total_sources=0,
            total_knowledge_items=0,
        )

    def _build_response(
        self,
        *,
        provider: str,
        embeddings: Sequence[Embedding],
    ) -> VectorSearchResponse:
        """Build a search response."""
        results = [
            VectorSearchResult(
                embedding_id=embedding.id,
                knowledge_id=embedding.knowledge_id,
                source_type=embedding.source_type,
                source_id=embedding.source_id,
                similarity_score=1.0,
                metadata=embedding.metadata_json or {},
            )
            for embedding in embeddings
        ]

        return VectorSearchResponse(
            provider=provider,
            total_results=len(results),
            results=results,
        )

    @staticmethod
    def _validate_provider(
        provider: str,
    ) -> None:
        """Validate the vector provider."""
        if provider != DEFAULT_PROVIDER:
            raise UnsupportedProviderError(
                f"Unsupported provider: {provider}",
            )
