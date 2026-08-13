/**
 * React Query hooks for AI document collection operations.
 *
 * Provides hooks for listing, creating, updating, deleting documents,
 * retrieving statistics, and resolving knowledge base options.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { aiDocumentQueryKeys } from "./useAIDocument";
import { aiDocumentService } from "../services/aiDocument.service";

import type {
  AIDocument,
  AIDocumentListQuery,
  AIDocumentListResponse,
  AIDocumentStatistics,
  AIKnowledgeBaseOption,
  CreateAIDocumentRequest,
  UpdateAIDocumentRequest,
} from "../types/aiDocument.types";

/**
 * Statistics query key.
 */
const aiDocumentStatisticsQueryKey = [
  ...aiDocumentQueryKeys.all,
  "statistics",
] as const;

/**
 * Knowledge base options query key.
 */
const aiKnowledgeBaseOptionsQueryKey = [
  ...aiDocumentQueryKeys.all,
  "knowledge-bases",
] as const;

/**
 * Retrieves a paginated list of AI documents.
 *
 * @param query - Document list query.
 * @returns React Query result.
 */
export const useAIDocuments = (query?: AIDocumentListQuery) =>
  useQuery<AIDocumentListResponse>({
    queryKey: [...aiDocumentQueryKeys.all, "list", query] as const,

    queryFn: () => aiDocumentService.listDocuments(query),
  });

/**
 * Retrieves AI document statistics.
 *
 * @returns React Query result.
 */
export const useAIDocumentStatistics = () =>
  useQuery<AIDocumentStatistics>({
    queryKey: aiDocumentStatisticsQueryKey,

    queryFn: () => aiDocumentService.getStatistics(),
  });

/**
 * Retrieves the knowledge base options a document may be registered
 * under.
 *
 * @returns React Query result.
 */
export const useAIKnowledgeBaseOptions = () =>
  useQuery<readonly AIKnowledgeBaseOption[]>({
    queryKey: aiKnowledgeBaseOptionsQueryKey,

    queryFn: () => aiDocumentService.listKnowledgeBases(),
  });

/**
 * Registers a new AI document.
 *
 * @returns Mutation.
 */
export const useCreateAIDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<AIDocument, Error, CreateAIDocumentRequest>({
    mutationFn: (payload) => aiDocumentService.createDocument(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: aiDocumentQueryKeys.all,
      });
    },
  });
};

/**
 * Update AI document variables.
 */
interface UpdateAIDocumentVariables {
  readonly id: string;
  readonly payload: UpdateAIDocumentRequest;
}

/**
 * Updates an AI document.
 *
 * @returns Mutation.
 */
export const useUpdateAIDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<AIDocument, Error, UpdateAIDocumentVariables>({
    mutationFn: ({ id, payload }) =>
      aiDocumentService.updateDocument(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: aiDocumentQueryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: aiDocumentQueryKeys.detail(variables.id),
        }),
      ]);
    },
  });
};

/**
 * Deletes an AI document.
 *
 * @returns Mutation.
 */
export const useDeleteAIDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (documentId) => aiDocumentService.deleteDocument(documentId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: aiDocumentQueryKeys.all,
      });
    },
  });
};
