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
  | "archived";

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
   * Conversation messages.
   */
  readonly messages: readonly AIMessage[];

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
   * Conversation identifier.
   */
  readonly conversationId?: string;

  /**
   * User prompt.
   */
  readonly prompt: string;
}

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