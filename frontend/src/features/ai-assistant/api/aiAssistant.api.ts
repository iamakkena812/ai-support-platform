/**
 * AI Assistant API.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  AIChatRequest,
  AIChatResponse,
  AIConversation,
  AIConversationListQuery,
  AIConversationListResponse,
} from "../types/aiAssistant.types";

/**
 * AI Assistant API client.
 */
export const aiAssistantApi = {
  /**
   * Returns a paginated list of conversations.
   *
   * @param query - Query parameters.
   * @returns Paginated conversation response.
   */
  async listConversations(
    query: AIConversationListQuery,
  ): Promise<AIConversationListResponse> {
    const response =
      await apiClient.get<
        AIConversationListResponse
      >(
        "/ai-assistant/conversations",
        {
          params: query,
        },
      );

    return response.data;
  },

  /**
   * Returns a conversation.
   *
   * @param conversationId - Conversation identifier.
   * @returns Conversation.
   */
  async getConversation(
    conversationId: string,
  ): Promise<AIConversation> {
    const response =
      await apiClient.get<
        AIConversation
      >(
        `/ai-assistant/conversations/${conversationId}`,
      );

    return response.data;
  },

  /**
   * Sends a chat prompt.
   *
   * @param request - Chat request.
   * @returns Chat response.
   */
  async sendMessage(
    request: AIChatRequest,
  ): Promise<AIChatResponse> {
    const response =
      await apiClient.post<
        AIChatResponse
      >(
        "/ai-assistant/chat",
        request,
      );

    return response.data;
  },

  /**
   * Deletes a conversation.
   *
   * @param conversationId - Conversation identifier.
   */
  async deleteConversation(
    conversationId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/ai-assistant/conversations/${conversationId}`,
    );
  },
};