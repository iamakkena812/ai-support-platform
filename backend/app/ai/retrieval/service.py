"""Service for the AI Retrieval module."""

from __future__ import annotations

import re
from uuid import UUID

from app.ai.embeddings.models import Embedding
from app.ai.retrieval.constants import (
    DEFAULT_PROVIDER,
    MAX_LIMIT,
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

_TERM_PATTERN = re.compile(r"[a-z0-9]+")


class RetrievalService:
    """Service for retrieval operations.

    Retrieval uses a genuine local keyword-relevance signal computed from
    stored embedding content: no embedding-generation provider exists
    anywhere in this codebase, so true vector/semantic similarity is not
    available (see ``hybrid_retrieve`` and the module's final phase report).
    """

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
        organization_id: UUID,
        request: RetrievalRequest,
    ) -> RetrievalResponse:
        """Perform local keyword-based retrieval.

        Args:
            organization_id: Requesting user's organization.
            request: Retrieval request.

        Returns:
            Retrieval response.
        """
        self._validate_provider(request.provider)

        documents = self._search(
            organization_id=organization_id,
            query=request.query,
            top_k=request.top_k,
            score_threshold=request.score_threshold,
        )

        return RetrievalResponse(
            provider=request.provider,
            documents=documents,
            total_documents=len(documents),
        )

    def hybrid_retrieve(
        self,
        organization_id: UUID,
        request: HybridRetrievalRequest,
    ) -> RetrievalResponse:
        """Perform hybrid retrieval.

        Only a keyword signal is available. The returned score is the
        keyword relevance scaled by ``keyword_weight``; the semantic
        component contributes zero because no embedding provider or vector
        similarity implementation is configured.

        Args:
            organization_id: Requesting user's organization.
            request: Hybrid retrieval request.

        Returns:
            Retrieval response.
        """
        self._validate_provider(request.provider)

        documents = self._search(
            organization_id=organization_id,
            query=request.query,
            top_k=request.top_k,
            score_threshold=request.score_threshold,
            display_weight=request.keyword_weight,
        )

        return RetrievalResponse(
            provider=request.provider,
            documents=documents,
            total_documents=len(documents),
        )

    def metadata_search(
        self,
        organization_id: UUID,
        request: MetadataSearchRequest,
    ) -> RetrievalResponse:
        """Search using metadata filters.

        Args:
            organization_id: Requesting user's organization.
            request: Metadata search request.

        Returns:
            Retrieval response.
        """
        embeddings = self._repository.metadata_search(
            organization_id,
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

    def statistics(
        self,
        organization_id: UUID,
    ) -> RetrievalStatisticsResponse:
        """Return retrieval statistics for the organization.

        Args:
            organization_id: Requesting user's organization.

        Returns:
            Retrieval statistics.
        """
        total = self._repository.count_documents(organization_id)

        return RetrievalStatisticsResponse(
            provider=DEFAULT_PROVIDER,
            total_documents=total,
            indexed_documents=total,
        )

    def _search(
        self,
        *,
        organization_id: UUID,
        query: str,
        top_k: int,
        score_threshold: float,
        display_weight: float = 1.0,
    ) -> list[RetrievedDocumentResponse]:
        """Score org-scoped embeddings against the query and rank them.

        Args:
            organization_id: Organization scope.
            query: Raw query text.
            top_k: Maximum number of results to return.
            score_threshold: Minimum keyword relevance required to match.
            display_weight: Multiplier applied to the returned score.

        Returns:
            Ranked, relevance-scored documents.
        """
        terms = self._tokenize(query)

        candidates = self._repository.search_by_terms(
            organization_id,
            terms,
            limit=MAX_LIMIT,
        )

        scored = [
            (embedding, self._relevance(embedding, terms))
            for embedding in candidates
        ]

        ranked = sorted(
            (
                item
                for item in scored
                if item[1] > 0.0 and item[1] >= score_threshold
            ),
            key=lambda item: item[1],
            reverse=True,
        )[:top_k]

        return [
            RetrievedDocumentResponse(
                id=str(embedding.id),
                content=embedding.content,
                score=round(relevance * display_weight, 4),
                metadata=embedding.metadata_json or {},
            )
            for embedding, relevance in ranked
        ]

    @staticmethod
    def _tokenize(text: str) -> list[str]:
        """Normalize text into lowercase alphanumeric terms.

        Args:
            text: Raw text.

        Returns:
            Normalized terms.
        """
        return _TERM_PATTERN.findall(text.lower())

    @classmethod
    def _relevance(
        cls,
        embedding: Embedding,
        terms: list[str],
    ) -> float:
        """Return the fraction of query terms found in the embedding content.

        Args:
            embedding: Candidate embedding.
            terms: Normalized query terms.

        Returns:
            Relevance score between 0.0 and 1.0.
        """
        if not terms:
            return 0.0

        content_terms = set(cls._tokenize(embedding.content))

        if not content_terms:
            return 0.0

        matched = sum(1 for term in terms if term in content_terms)

        return matched / len(terms)

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
