/**
 * AI Assistant React Query hooks.
 */

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { aiAssistantService } from "../services/aiAssistant.service";

import type {
  AIChatRequest,
  AIChatResponse,
} from "../types/aiAssistant.types";

/**
 * AI Assistant query keys.
 */
export const aiAssistantKeys = {
  /**
   * Root query key.
   */
  all: [
    "ai-assistant",
  ] as const,

  /**
   * Conversation list.
   */
  conversations: () =>
    [
      ...aiAssistantKeys.all,
      "conversations",
    ] as const,
};

/**
 * Sends a chat message.
 *
 * @returns React Query mutation.
 */
export function useAIChat() {
  const queryClient =
    useQueryClient();

  return useMutation<
    AIChatResponse,
    Error,
    AIChatRequest
  >({
    mutationFn: (
      request,
    ) =>
      aiAssistantService.sendMessage(
        request,
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