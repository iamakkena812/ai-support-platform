/**
 * AI Retrieval domain types.
 *
 * Mirrors the real backend contract in `app/ai/retrieval/schemas.py`.
 * The backend has no embedding-generation provider configured anywhere,
 * so retrieval uses a genuine local keyword-relevance signal rather than
 * vector similarity -- see `RetrievalService` on the backend.
 */

/**
 * Retrieval search mode.
 */
export type AIRetrievalMode = "keyword" | "hybrid" | "metadata";

/**
 * A single retrieved document.
 */
export interface AIRetrievedDocument {
  /**
   * Embedding identifier.
   */
  readonly id: string;

  /**
   * Indexed content.
   */
  readonly content: string;

  /**
   * Relevance score. For keyword/hybrid search this is a real
   * keyword-overlap score (0-1), not a vector similarity score.
   */
  readonly score: number;

  /**
   * Arbitrary metadata attached to the embedding.
   */
  readonly metadata: Readonly<Record<string, unknown>>;
}

/**
 * Result of a retrieval search.
 */
export interface AIRetrievalResult {
  readonly provider: string;
  readonly documents: readonly AIRetrievedDocument[];
  readonly totalDocuments: number;
}

/**
 * A supported retrieval provider.
 */
export interface AIRetrievalProvider {
  readonly name: string;
  readonly available: boolean;
}

/**
 * Retrieval statistics for the caller's organization.
 */
export interface AIRetrievalStatistics {
  readonly provider: string;
  readonly totalDocuments: number;
  readonly indexedDocuments: number;
}

/**
 * Request for keyword (local) retrieval.
 */
export interface RetrievalQueryRequest {
  readonly query: string;
  readonly provider?: string;
  readonly topK?: number;
  readonly scoreThreshold?: number;
}

/**
 * Request for hybrid retrieval.
 *
 * `semanticWeight` is accepted by the backend contract but never
 * contributes to the score -- there is no embedding provider configured.
 */
export interface HybridRetrievalQueryRequest extends RetrievalQueryRequest {
  readonly keywordWeight?: number;
  readonly semanticWeight?: number;
}

/**
 * Request for metadata search.
 */
export interface MetadataSearchQueryRequest {
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly limit?: number;
}
