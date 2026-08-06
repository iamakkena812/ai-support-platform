"""Service for the AI Retrieval module."""

from __future__ import annotations

from app.ai.retrieval.constants import (
    DEFAULT_PROVIDER,
    SUPPORTED_PROVIDERS,
)
from app.ai.retrieval.exceptions import (
    UnsupportedRetrievalProviderError,
)
from app.ai.retrieval.repository import RetrievalRepository
from app.ai.retrieval.schemas import (
    HybridRetrievalRequest,
    MetadataSearchRequest,
    ProviderListResponse,
    ProviderResponse,
    RetrievalRequest,
    RetrievalResponse,
    RetrievalStatisticsResponse,
    RetrievedDocumentResponse,
)


class RetrievalService:
    """Service for retrieval operations."""

    def __init__(
        self,
        repository: RetrievalRepository,
    ) -> None:
        """Initialize the retrieval service.

        Args:
            repository: Retrieval repository.
        """
        self._repository = repository

    def retrieve(
        self,
        request: RetrievalRequest,
    ) -> RetrievalResponse:
        """Perform semantic retrieval.

        Args:
            request: Retrieval request.

        Returns:
            Retrieval response.
        """
        self._validate_provider(request.provider)

        embeddings = self._repository.semantic_search(
            offset=0,
            limit=request.top_k,
        )

        documents = [
            RetrievedDocumentResponse(
                id=str(embedding.id),
                content=embedding.content,
                score=1.0,
                metadata=embedding.metadata_json or {},
            )
            for embedding in embeddings
        ]

        return RetrievalResponse(
            provider=request.provider,
            documents=documents,
            total_documents=len(documents),
        )

    def hybrid_retrieve(
        self,
        request: HybridRetrievalRequest,
    ) -> RetrievalResponse:
        """Perform hybrid retrieval.

        Args:
            request: Hybrid retrieval request.

        Returns:
            Retrieval response.
        """
        self._validate_provider(request.provider)

        embeddings = self._repository.hybrid_search(
            offset=0,
            limit=request.top_k,
        )

        documents = [
            RetrievedDocumentResponse(
                id=str(embedding.id),
                content=embedding.content,
                score=1.0,
                metadata=embedding.metadata_json or {},
            )
            for embedding in embeddings
        ]

        return RetrievalResponse(
            provider=request.provider,
            documents=documents,
            total_documents=len(documents),
        )

    def metadata_search(
        self,
        request: MetadataSearchRequest,
    ) -> RetrievalResponse:
        """Search using metadata filters.

        Args:
            request: Metadata search request.

        Returns:
            Retrieval response.
        """
        embeddings = self._repository.metadata_search(
            metadata=request.metadata,
            limit=request.limit,
        )

        documents = [
            RetrievedDocumentResponse(
                id=str(embedding.id),
                content=embedding.content,
                score=1.0,
                metadata=embedding.metadata_json or {},
            )
            for embedding in embeddings
        ]

        return RetrievalResponse(
            provider=DEFAULT_PROVIDER,
            documents=documents,
            total_documents=len(documents),
        )

    def providers(self) -> ProviderListResponse:
        """Return supported retrieval providers.

        Returns:
            Supported providers.
        """
        return ProviderListResponse(
            providers=[
                ProviderResponse(
                    name=provider,
                    available=True,
                )
                for provider in SUPPORTED_PROVIDERS
            ],
        )

    def statistics(self) -> RetrievalStatisticsResponse:
        """Return retrieval statistics.

        Returns:
            Retrieval statistics.
        """
        total = self._repository.count_documents()

        return RetrievalStatisticsResponse(
            provider=DEFAULT_PROVIDER,
            total_documents=total,
            indexed_documents=total,
        )

    @staticmethod
    def _validate_provider(
        provider: str,
    ) -> None:
        """Validate the retrieval provider.

        Args:
            provider: Provider name.

        Raises:
            UnsupportedRetrievalProviderError:
                If the provider is unsupported.
        """
        if provider not in SUPPORTED_PROVIDERS:
            raise UnsupportedRetrievalProviderError(
                f"Unsupported provider: {provider}",
            )
