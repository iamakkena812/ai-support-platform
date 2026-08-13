/**
 * AI Assistant API.
 *
 * Talks to the real backend AI Chat endpoints (`/api/v1/ai/chat/*`,
 * see `app/ai/chat/router.py`) and adapts its snake_case, two-step
 * (create conversation, then send message) contract to the simpler
 * one-shot prompt UX the existing components expect.
 */

import { apiClient } from "../../../api/axios/client";

import {
  DEFAULT_AI_MODEL,
  DEFAULT_AI_PROVIDER,
} from "../types/aiAssistant.types";

import type {
  AIChatRequest,
  AIChatResponse,
  AIConversation,
  AIConversationListQuery,
  AIConversationListResponse,
  AIConversationStatus,
  AIMessage,
  AIMessageRole,
} from "../types/aiAssistant.types";

/**
 * Backend conversation representation (snake_case wire contract).
 */
interface BackendConversation {
  readonly id: string;
  readonly title: string;
  readonly status: AIConversationStatus;
  readonly provider: string;
  readonly model: string;
  readonly message_count: number;
  readonly created_at: string;
  readonly updated_at: string;
}

/**
 * Backend message representation (snake_case wire contract).
 */
interface BackendMessage {
  readonly id: string;
  readonly conversation_id: string;
  readonly role: AIMessageRole;
  readonly content: string;
  readonly token_count: number;
  readonly created_at: string;
}

interface BackendConversationListResponse {
  readonly items: readonly BackendConversation[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number;
}

interface BackendConversationHistoryResponse {
  readonly conversation: BackendConversation;
  readonly messages: readonly BackendMessage[];
}

interface BackendChatResponse {
  readonly conversation: BackendConversation;
  readonly user_message: BackendMessage;
  readonly assistant_message: BackendMessage;
}

const BASE_PATH = "/ai/chat";

/**
 * Maps a backend message into the frontend message model.
 *
 * `sources` (RAG citations) and `streaming` are NOT IMPLEMENTED by the
 * current backend chat endpoint — it always returns a single completed
 * message, so these are always empty/false rather than fabricated.
 *
 * @param message - Backend message.
 * @returns Frontend AI message.
 */
function mapMessage(message: BackendMessage): AIMessage {
  return {
    id: message.id,
    conversationId: message.conversation_id,
    role: message.role,
    content: message.content,
    sources: [],
    streaming: false,
    tokenCount: message.token_count,
    createdAt: message.created_at,
  };
}

/**
 * Maps a backend conversation into the frontend conversation model.
 *
 * @param conversation - Backend conversation.
 * @param messages - Full message list, if already fetched.
 * @returns Frontend AI conversation.
 */
function mapConversation(
  conversation: BackendConversation,
  messages: readonly AIMessage[] = [],
): AIConversation {
  return {
    id: conversation.id,
    title: conversation.title,
    status: conversation.status,
    provider: conversation.provider,
    model: conversation.model,
    messages,
    messageCount: conversation.message_count,
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
  };
}

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
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const { data } = await apiClient.get<BackendConversationListResponse>(
      `${BASE_PATH}/conversations`,
      {
        params: {
          offset: (page - 1) * pageSize,
          limit: pageSize,
        },
      },
    );

    return {
      items: data.items.map((item) => mapConversation(item)),
      total: data.total,
      page,
      pageSize,
      totalPages: pageSize > 0 ? Math.ceil(data.total / pageSize) : 0,
    };
  },

  /**
   * Returns a conversation with its full message history.
   *
   * @param conversationId - Conversation identifier.
   * @returns Conversation.
   */
  async getConversation(
    conversationId: string,
  ): Promise<AIConversation> {
    const { data } = await apiClient.get<BackendConversationHistoryResponse>(
      `${BASE_PATH}/conversations/${conversationId}/messages`,
    );

    return mapConversation(
      data.conversation,
      data.messages.map(mapMessage),
    );
  },

  /**
   * Sends a chat prompt.
   *
   * Starts a new conversation first if `conversationId` is not
   * supplied, matching the backend's two-step create-then-chat flow.
   *
   * @param request - Chat request.
   * @returns Chat response.
   */
  async sendMessage(
    request: AIChatRequest,
  ): Promise<AIChatResponse> {
    let conversationId = request.conversationId;

    if (!conversationId) {
      const { data: created } = await apiClient.post<BackendConversation>(
        `${BASE_PATH}/conversations`,
        {
          title: request.prompt.slice(0, 60),
          provider: DEFAULT_AI_PROVIDER,
          model: DEFAULT_AI_MODEL,
        },
      );

      conversationId = created.id;
    }

    const { data } = await apiClient.post<BackendChatResponse>(
      `${BASE_PATH}/conversations/${conversationId}/chat`,
      {
        conversation_id: conversationId,
        message: request.prompt,
      },
    );

    const userMessage = mapMessage(data.user_message);
    const assistantMessage = mapMessage(data.assistant_message);

    return {
      conversation: mapConversation(data.conversation, [
        userMessage,
        assistantMessage,
      ]),
      message: assistantMessage,
    };
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
      `${BASE_PATH}/conversations/${conversationId}`,
    );
  },
};
