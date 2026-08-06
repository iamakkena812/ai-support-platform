/**
 * AI Assistant utility functions.
 */

import type {
  AIConversation,
  AIMessage,
  AIMessageRole,
} from "../types/aiAssistant.types";

/**
 * Formats a message role.
 *
 * @param role - Message role.
 * @returns Formatted role.
 */
export function formatMessageRole(
  role: AIMessageRole,
): string {
  switch (
    role
  ) {
    case "assistant":
      return "AI Assistant";

    case "user":
      return "You";

    case "system":
      return "System";

    default:
      return role;
  }
}

/**
 * Formats a timestamp.
 *
 * @param value - ISO timestamp.
 * @returns Formatted timestamp.
 */
export function formatConversationDate(
  value: string,
): string {
  return new Date(
    value,
  ).toLocaleString();
}

/**
 * Returns the latest message.
 *
 * @param conversation - Conversation.
 * @returns Latest message, if available.
 */
export function getLatestMessage(
  conversation: AIConversation,
): AIMessage | undefined {
  if (
    conversation.messages.length ===
    0
  ) {
    return undefined;
  }

  return conversation.messages[
    conversation.messages.length -
      1
  ];
}

/**
 * Returns the total number of tokens
 * used in a conversation.
 *
 * @param conversation - Conversation.
 * @returns Total token count.
 */
export function getConversationTokenCount(
  conversation: AIConversation,
): number {
  return conversation.messages.reduce(
    (
      total,
      message,
    ) =>
      total +
      message.tokenCount,
    0,
  );
}

/**
 * Truncates text.
 *
 * @param value - Text.
 * @param length - Maximum length.
 * @returns Truncated text.
 */
export function truncateConversationText(
  value: string,
  length = 120,
): string {
  if (
    value.length <=
    length
  ) {
    return value;
  }

  return `${value.slice(
    0,
    length,
  )}...`;
}