/**
 * React Query hooks for AI knowledge base collection operations.
 *
 * Provides hooks for listing, creating, updating, and deleting
 * knowledge bases.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { aiKnowledgeQueryKeys } from "./useAIKnowledgeBase";
import { aiKnowledgeService } from "../services/aiKnowledge.service";

import type {
  AIKnowledgeBase,
  AIKnowledgeListQuery,
  AIKnowledgeListResponse,
  CreateAIKnowledgeRequest,
  UpdateAIKnowledgeRequest,
} from "../types/aiKnowledge.types";

/**
 * Retrieves a paginated list of AI knowledge bases.
 *
 * @param query - Knowledge base list query.
 * @returns React Query result.
 */
export const useAIKnowledgeBases = (query?: AIKnowledgeListQuery) =>
  useQuery<AIKnowledgeListResponse>({
    queryKey: [...aiKnowledgeQueryKeys.all, "list", query] as const,

    queryFn: () => aiKnowledgeService.listKnowledgeBases(query),
  });

/**
 * Creates a new AI knowledge base.
 *
 * @returns Mutation.
 */
export const useCreateAIKnowledgeBase = () => {
  const queryClient = useQueryClient();

  return useMutation<AIKnowledgeBase, Error, CreateAIKnowledgeRequest>({
    mutationFn: (payload) => aiKnowledgeService.createKnowledgeBase(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: aiKnowledgeQueryKeys.all,
      });
    },
  });
};

/**
 * Update AI knowledge base variables.
 */
interface UpdateAIKnowledgeBaseVariables {
  readonly id: string;
  readonly payload: UpdateAIKnowledgeRequest;
}

/**
 * Updates an AI knowledge base.
 *
 * @returns Mutation.
 */
export const useUpdateAIKnowledgeBase = () => {
  const queryClient = useQueryClient();

  return useMutation<AIKnowledgeBase, Error, UpdateAIKnowledgeBaseVariables>({
    mutationFn: ({ id, payload }) =>
      aiKnowledgeService.updateKnowledgeBase(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: aiKnowledgeQueryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: aiKnowledgeQueryKeys.detail(variables.id),
        }),
      ]);
    },
  });
};

/**
 * Deletes an AI knowledge base.
 *
 * @returns Mutation.
 */
export const useDeleteAIKnowledgeBase = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (knowledgeId) =>
      aiKnowledgeService.deleteKnowledgeBase(knowledgeId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: aiKnowledgeQueryKeys.all,
      });
    },
  });
};
