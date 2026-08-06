"""Tests for the AI Retrieval repository."""

from __future__ import annotations

from app.ai.embeddings.models import Embedding
from app.ai.retrieval.repository import RetrievalRepository


def test_semantic_search_returns_results(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Semantic search should return stored embeddings."""
    results = retrieval_repository.semantic_search()

    assert len(results) == 1
    assert results[0].id == embedding.id


def test_semantic_search_returns_empty_list(
    retrieval_repository: RetrievalRepository,
) -> None:
    """Semantic search should return an empty list."""
    results = retrieval_repository.semantic_search()

    assert results == []


def test_hybrid_search_returns_results(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Hybrid search should return stored embeddings."""
    results = retrieval_repository.hybrid_search()

    assert len(results) == 1
    assert results[0].id == embedding.id


def test_metadata_search_returns_results(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Metadata search should return matching embeddings."""
    results = retrieval_repository.metadata_search(
        metadata=embedding.metadata_json,
    )

    assert len(results) == 1
    assert results[0].id == embedding.id


def test_metadata_search_returns_empty_list(
    retrieval_repository: RetrievalRepository,
) -> None:
    """Metadata search should return an empty list."""
    results = retrieval_repository.metadata_search(
        metadata={"source": "unknown"},
    )

    assert results == []


def test_count_documents_returns_total(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Count should return the total indexed documents."""
    count = retrieval_repository.count_documents()

    assert count == 1


def test_semantic_search_respects_limit(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Semantic search should respect the limit."""
    results = retrieval_repository.semantic_search(
        limit=1,
    )

    assert len(results) == 1


def test_semantic_search_respects_offset(
    retrieval_repository: RetrievalRepository,
    embedding: Embedding,
) -> None:
    """Semantic search should respect the offset."""
    results = retrieval_repository.semantic_search(
        offset=1,
        limit=10,
    )

    assert results == []
