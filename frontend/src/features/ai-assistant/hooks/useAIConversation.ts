/**
 * AI Assistant conversation hooks.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { aiAssistantService } from "../services/aiAssistant.service";

import type {
  AIConversation,
  AIConversationListQuery,
  AIConversationListResponse,
} from "../types/aiAssistant.types";

import { aiAssistantKeys } from "./useAIChat";

/**
 * Returns a paginated list of AI conversations.
 *
 * @param query - Query values.
 * @returns React Query result.
 */
export function useAIConversations(
  query: AIConversationListQuery,
) {
  return useQuery<
    AIConversationListResponse
  >({
    queryKey: [
      ...aiAssistantKeys.conversations(),
      query,
    ],

    queryFn: () =>
      aiAssistantService.listConversations(
        query,
      ),
  });
}

/**
 * Returns a single AI conversation.
 *
 * @param conversationId - Conversation identifier.
 * @returns React Query result.
 */
export function useAIConversation(
  conversationId: string,
) {
  return useQuery<
    AIConversation
  >({
    queryKey: [
      ...aiAssistantKeys.conversations(),
      conversationId,
    ],

    queryFn: () =>
      aiAssistantService.getConversation(
        conversationId,
      ),

    enabled:
      conversationId.length >
      0,
  });
}

/**
 * Deletes an AI conversation.
 *
 * @returns React Query mutation.
 */
export function useDeleteAIConversation() {
  const queryClient =
    useQueryClient();

  return useMutation<
    void,
    Error,
    string
  >({
    mutationFn: (
      conversationId,
    ) =>
      aiAssistantService.deleteConversation(
        conversationId,
      ),

    onSuccess: () => {
      void queryClient.invalidateQueries(
        {
          queryKey:
            aiAssistantKeys.conversations(),
        },
      );
    },
  });
}