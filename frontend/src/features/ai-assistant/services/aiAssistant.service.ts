/**
 * AI Assistant service.
 */

import { aiAssistantApi } from "../api/aiAssistant.api";

import type {
  AIChatRequest,
  AIChatResponse,
  AIConversation,
  AIConversationListQuery,
  AIConversationListResponse,
} from "../types/aiAssistant.types";

/**
 * AI Assistant service.
 *
 * Encapsulates business operations for
 * AI Assistant conversations.
 */
export const aiAssistantService = {
  /**
   * Returns a paginated list of conversations.
   *
   * @param query - Query parameters.
   * @returns Paginated conversation response.
   */
  listConversations(
    query: AIConversationListQuery,
  ): Promise<AIConversationListResponse> {
    return aiAssistantApi.listConversations(
      query,
    );
  },

  /**
   * Returns a conversation.
   *
   * @param conversationId - Conversation identifier.
   * @returns Conversation.
   */
  getConversation(
    conversationId: string,
  ): Promise<AIConversation> {
    return aiAssistantApi.getConversation(
      conversationId,
    );
  },

  /**
   * Sends a chat message.
   *
   * @param request - Chat request.
   * @returns Chat response.
   */
  sendMessage(
    request: AIChatRequest,
  ): Promise<AIChatResponse> {
    return aiAssistantApi.sendMessage(
      request,
    );
  },

  /**
   * Deletes a conversation.
   *
   * @param conversationId - Conversation identifier.
   */
  deleteConversation(
    conversationId: string,
  ): Promise<void> {
    return aiAssistantApi.deleteConversation(
      conversationId,
    );
  },
};