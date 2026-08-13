/**
 * AI Retrieval API.
 *
 * Talks to the real backend AI Retrieval endpoints
 * (`/api/v1/ai/retrieval/*`, see `app/ai/retrieval/router.py`), which use
 * a plain snake_case JSON contract (no camelCase alias generator).
 */

import { apiClient } from "../../../api/axios/client";

import type {
  AIRetrievalProvider,
  AIRetrievalResult,
  AIRetrievalStatistics,
  HybridRetrievalQueryRequest,
  MetadataSearchQueryRequest,
  RetrievalQueryRequest,
} from "../types/aiRetrieval.types";

interface BackendRetrievedDocument {
  readonly id: string;
  readonly content: string;
  readonly score: number;
  readonly metadata: Readonly<Record<string, unknown>>;
}

interface BackendRetrievalResponse {
  readonly provider: string;
  readonly documents: readonly BackendRetrievedDocument[];
  readonly total_documents: number;
}

interface BackendProvider {
  readonly name: string;
  readonly available: boolean;
}

interface BackendProviderListResponse {
  readonly providers: readonly BackendProvider[];
}

interface BackendStatisticsResponse {
  readonly provider: string;
  readonly total_documents: number;
  readonly indexed_documents: number;
}

const BASE_PATH = "/ai/retrieval";

/**
 * Maps a backend retrieval response into the frontend model.
 *
 * @param data - Backend retrieval response.
 * @returns Frontend retrieval result.
 */
function mapResult(data: BackendRetrievalResponse): AIRetrievalResult {
  return {
    provider: data.provider,
    documents: data.documents,
    totalDocuments: data.total_documents,
  };
}

/**
 * AI Retrieval API client.
 */
export const aiRetrievalApi = {
  /**
   * Performs local keyword-based retrieval.
   *
   * @param request - Retrieval request.
   * @returns Retrieval result.
   */
  async retrieve(request: RetrievalQueryRequest): Promise<AIRetrievalResult> {
    const { data } = await apiClient.post<BackendRetrievalResponse>(
      `${BASE_PATH}/retrieve`,
      {
        query: request.query,
        provider: request.provider,
        top_k: request.topK,
        score_threshold: request.scoreThreshold,
      },
    );

    return mapResult(data);
  },

  /**
   * Performs hybrid retrieval.
   *
   * @param request - Hybrid retrieval request.
   * @returns Retrieval result.
   */
  async hybridRetrieve(
    request: HybridRetrievalQueryRequest,
  ): Promise<AIRetrievalResult> {
    const { data } = await apiClient.post<BackendRetrievalResponse>(
      `${BASE_PATH}/hybrid`,
      {
        query: request.query,
        provider: request.provider,
        top_k: request.topK,
        score_threshold: request.scoreThreshold,
        keyword_weight: request.keywordWeight,
        semantic_weight: request.semanticWeight,
      },
    );

    return mapResult(data);
  },

  /**
   * Searches embeddings by metadata filters.
   *
   * @param request - Metadata search request.
   * @returns Retrieval result.
   */
  async metadataSearch(
    request: MetadataSearchQueryRequest,
  ): Promise<AIRetrievalResult> {
    const { data } = await apiClient.post<BackendRetrievalResponse>(
      `${BASE_PATH}/metadata-search`,
      {
        metadata: request.metadata ?? {},
        limit: request.limit,
      },
    );

    return mapResult(data);
  },

  /**
   * Returns the retrieval providers supported by the backend.
   *
   * @returns Supported providers.
   */
  async listProviders(): Promise<readonly AIRetrievalProvider[]> {
    const { data } = await apiClient.get<BackendProviderListResponse>(
      `${BASE_PATH}/providers`,
    );

    return data.providers;
  },

  /**
   * Returns retrieval statistics for the caller's organization.
   *
   * @returns Retrieval statistics.
   */
  async getStatistics(): Promise<AIRetrievalStatistics> {
    const { data } = await apiClient.get<BackendStatisticsResponse>(
      `${BASE_PATH}/statistics`,
    );

    return {
      provider: data.provider,
      totalDocuments: data.total_documents,
      indexedDocuments: data.indexed_documents,
    };
  },
};
