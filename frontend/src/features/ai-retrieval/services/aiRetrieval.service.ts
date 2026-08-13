/**
 * AI Retrieval service.
 *
 * Provides the service layer between the UI and the AI Retrieval API
 * client.
 */

import { aiRetrievalApi } from "../api/aiRetrieval.api";

import type {
  AIRetrievalProvider,
  AIRetrievalResult,
  AIRetrievalStatistics,
  HybridRetrievalQueryRequest,
  MetadataSearchQueryRequest,
  RetrievalQueryRequest,
} from "../types/aiRetrieval.types";

/**
 * AI Retrieval service.
 */
export const aiRetrievalService = {
  /**
   * Performs local keyword-based retrieval.
   *
   * @param request - Retrieval request.
   * @returns Retrieval result.
   */
  async retrieve(request: RetrievalQueryRequest): Promise<AIRetrievalResult> {
    return aiRetrievalApi.retrieve(request);
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
    return aiRetrievalApi.hybridRetrieve(request);
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
    return aiRetrievalApi.metadataSearch(request);
  },

  /**
   * Returns the retrieval providers supported by the backend.
   *
   * @returns Supported providers.
   */
  async listProviders(): Promise<readonly AIRetrievalProvider[]> {
    return aiRetrievalApi.listProviders();
  },

  /**
   * Returns retrieval statistics for the caller's organization.
   *
   * @returns Retrieval statistics.
   */
  async getStatistics(): Promise<AIRetrievalStatistics> {
    return aiRetrievalApi.getStatistics();
  },
};
