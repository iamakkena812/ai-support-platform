"""Tests for the AI RAG repository."""

from __future__ import annotations

from app.ai.embeddings.models import Embedding
from app.ai.rag.repository import RAGRepository


def test_list_embeddings_returns_results(
    rag_repository: RAGRepository,
    embedding: Embedding,
) -> None:
    """List embeddings should return stored embeddings."""
    results = rag_repository.list_embeddings()

    assert len(results) == 1
    assert results[0].id == embedding.id


def test_list_embeddings_returns_empty_list(
    rag_repository: RAGRepository,
) -> None:
    """List embeddings should return an empty list when no data exists."""
    results = rag_repository.list_embeddings()

    assert results == []


def test_get_embedding_count_returns_total(
    rag_repository: RAGRepository,
    embedding: Embedding,
) -> None:
    """Embedding count should return the total number of embeddings."""
    count = rag_repository.get_embedding_count()

    assert count == 1


def test_list_embeddings_respects_limit(
    rag_repository: RAGRepository,
    embedding: Embedding,
) -> None:
    """List embeddings should respect the requested limit."""
    results = rag_repository.list_embeddings(
        offset=0,
        limit=1,
    )

    assert len(results) == 1


def test_list_embeddings_respects_offset(
    rag_repository: RAGRepository,
    embedding: Embedding,
) -> None:
    """List embeddings should respect the requested offset."""
    results = rag_repository.list_embeddings(
        offset=1,
        limit=10,
    )

    assert results == []
