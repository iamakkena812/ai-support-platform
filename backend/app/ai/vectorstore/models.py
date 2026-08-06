"""Domain models for the AI Vector Store module."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Protocol
from uuid import UUID


@dataclass(slots=True, frozen=True)
class SearchResult:
    """Represents a single vector search result."""

    embedding_id: UUID
    similarity_score: float
    source_type: str
    source_id: UUID
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True, frozen=True)
class ProviderInfo:
    """Represents a vector provider."""

    name: str
    display_name: str
    supports_semantic_search: bool
    supports_similarity_search: bool
    supports_hybrid_search: bool
    supports_metadata_filtering: bool
    supports_deletion: bool
    supports_updates: bool


@dataclass(slots=True, frozen=True)
class VectorStatistics:
    """Represents Vector Store statistics."""

    total_embeddings: int
    total_sources: int
    total_knowledge_items: int
    provider: str


class VectorStoreProvider(Protocol):
    """Protocol implemented by all vector store providers."""

    @property
    def name(self) -> str:
        """Return the provider name."""
        ...

    def semantic_search(
        self,
        query_embedding: list[float],
        *,
        top_k: int,
    ) -> list[SearchResult]:
        """Perform semantic vector search."""
        ...

    def similar_embeddings(
        self,
        embedding_id: UUID,
        *,
        top_k: int,
    ) -> list[SearchResult]:
        """Return embeddings similar to an existing embedding."""
        ...

    def hybrid_search(
        self,
        query: str,
        query_embedding: list[float],
        *,
        top_k: int,
    ) -> list[SearchResult]:
        """Perform hybrid keyword and vector search."""
        ...

    def statistics(self) -> VectorStatistics:
        """Return provider statistics."""
        ...

    def is_available(self) -> bool:
        """Return whether the provider is available."""
        ...
