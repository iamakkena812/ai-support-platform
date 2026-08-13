/**
 * React Query hooks for AI Retrieval.
 *
 * Search is on-demand (the user submits a query), so retrieval,
 * hybrid retrieval, and metadata search are mutations rather than an
 * auto-fetching list query. Providers and statistics are plain queries.
 */

import { useMutation, useQuery } from "@tanstack/react-query";

import { aiRetrievalService } from "../services/aiRetrieval.service";

import type {
  AIRetrievalProvider,
  AIRetrievalResult,
  AIRetrievalStatistics,
  HybridRetrievalQueryRequest,
  MetadataSearchQueryRequest,
  RetrievalQueryRequest,
} from "../types/aiRetrieval.types";

/**
 * Query keys for AI Retrieval.
 */
export const aiRetrievalQueryKeys = {
  all: ["ai-retrieval"] as const,
  providers: () => [...aiRetrievalQueryKeys.all, "providers"] as const,
  statistics: () => [...aiRetrievalQueryKeys.all, "statistics"] as const,
};

/**
 * Retrieves the retrieval providers supported by the backend.
 *
 * @returns React Query result.
 */
export const useAIRetrievalProviders = () =>
  useQuery<readonly AIRetrievalProvider[]>({
    queryKey: aiRetrievalQueryKeys.providers(),

    queryFn: () => aiRetrievalService.listProviders(),
  });

/**
 * Retrieves retrieval statistics for the caller's organization.
 *
 * @returns React Query result.
 */
export const useAIRetrievalStatistics = () =>
  useQuery<AIRetrievalStatistics>({
    queryKey: aiRetrievalQueryKeys.statistics(),

    queryFn: () => aiRetrievalService.getStatistics(),
  });

/**
 * Performs local keyword-based retrieval.
 *
 * @returns Mutation.
 */
export const useRetrieveDocuments = () =>
  useMutation<AIRetrievalResult, Error, RetrievalQueryRequest>({
    mutationFn: (payload) => aiRetrievalService.retrieve(payload),
  });

/**
 * Performs hybrid retrieval.
 *
 * @returns Mutation.
 */
export const useHybridRetrieveDocuments = () =>
  useMutation<AIRetrievalResult, Error, HybridRetrievalQueryRequest>({
    mutationFn: (payload) => aiRetrievalService.hybridRetrieve(payload),
  });

/**
 * Searches embeddings by metadata filters.
 *
 * @returns Mutation.
 */
export const useMetadataSearchDocuments = () =>
  useMutation<AIRetrievalResult, Error, MetadataSearchQueryRequest>({
    mutationFn: (payload) => aiRetrievalService.metadataSearch(payload),
  });
