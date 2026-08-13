/**
 * AI Assistant domain types.
 *
 * Defines the TypeScript models used throughout the
 * AI Assistant feature.
 */

/**
 * Sender role.
 */
export type AIMessageRole =
  | "system"
  | "user"
  | "assistant";

/**
 * Conversation status.
 */
export type AIConversationStatus =
  | "active"
  | "archived"
  | "closed";

/**
 * AI source reference.
 */
export interface AISourceReference {
  /**
   * Source identifier.
   */
  readonly id: string;

  /**
   * Source title.
   */
  readonly title: string;

  /**
   * Source URL.
   */
  readonly url?: string | null;

  /**
   * Relevance score.
   */
  readonly score: number;
}

/**
 * AI message.
 */
export interface AIMessage {
  /**
   * Message identifier.
   */
  readonly id: string;

  /**
   * Conversation identifier.
   */
  readonly conversationId: string;

  /**
   * Sender role.
   */
  readonly role: AIMessageRole;

  /**
   * Message content.
   */
  readonly content: string;

  /**
   * Referenced sources.
   */
  readonly sources: readonly AISourceReference[];

  /**
   * Indicates whether the response
   * is currently streaming.
   */
  readonly streaming: boolean;

  /**
   * Token count.
   */
  readonly tokenCount: number;

  /**
   * Created timestamp.
   */
  readonly createdAt: string;
}

/**
 * AI conversation.
 */
export interface AIConversation {
  /**
   * Conversation identifier.
   */
  readonly id: string;

  /**
   * Conversation title.
   */
  readonly title: string;

  /**
   * Conversation status.
   */
  readonly status: AIConversationStatus;

  /**
   * AI provider backing this conversation.
   */
  readonly provider: string;

  /**
   * AI model backing this conversation.
   */
  readonly model: string;

  /**
   * Conversation messages.
   *
   * Populated when the conversation is fetched individually; list
   * results only include `messageCount` to avoid an N+1 fetch.
   */
  readonly messages: readonly AIMessage[];

  /**
   * Total message count.
   */
  readonly messageCount: number;

  /**
   * Created timestamp.
   */
  readonly createdAt: string;

  /**
   * Updated timestamp.
   */
  readonly updatedAt: string;
}

/**
 * Chat request.
 */
export interface AIChatRequest {
  /**
   * Conversation identifier. Omit to start a new conversation.
   */
  readonly conversationId?: string;

  /**
   * User prompt.
   */
  readonly prompt: string;
}

/**
 * Default AI provider/model used when starting a new conversation.
 *
 * The UI has no provider picker, and the only fully implemented,
 * always-available provider in this environment is "mock" (no
 * external API key configured) — see `app/ai/providers/*` on the
 * backend. Real providers (currently only OpenAI has a working
 * implementation) require `OPENAI_API_KEY` to be configured.
 */
export const DEFAULT_AI_PROVIDER = "mock";
export const DEFAULT_AI_MODEL = "gpt-4.1";

/**
 * Chat response.
 */
export interface AIChatResponse {
  /**
   * Conversation.
   */
  readonly conversation: AIConversation;

  /**
   * Assistant message.
   */
  readonly message: AIMessage;
}

/**
 * Conversation list query.
 */
export interface AIConversationListQuery {
  /**
   * Page number.
   */
  readonly page?: number;

  /**
   * Page size.
   */
  readonly pageSize?: number;

  /**
   * Search text.
   */
  readonly search?: string;
}

/**
 * Paginated conversation response.
 */
export interface AIConversationListResponse {
  /**
   * Conversations.
   */
  readonly items: readonly AIConversation[];

  /**
   * Total records.
   */
  readonly total: number;

  /**
   * Current page.
   */
  readonly page: number;

  /**
   * Page size.
   */
  readonly pageSize: number;

  /**
   * Total pages.
   */
  readonly totalPages: number;
}