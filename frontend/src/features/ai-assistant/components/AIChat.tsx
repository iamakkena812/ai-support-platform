/**
 * AI chat component.
 */

import { AIMessage } from "./AIMessage";
import { AIMessageInput } from "./AIMessageInput";

import type {
  AIConversation,
} from "../types/aiAssistant.types";

/**
 * Component properties.
 */
export interface AIChatProps {
  /**
   * Active conversation.
   */
  readonly conversation?: AIConversation;

  /**
   * Indicates whether a message
   * is currently being sent.
   */
  readonly isSending?: boolean;

  /**
   * Invoked when a prompt is sent.
   *
   * @param prompt - User prompt.
   */
  readonly onSend: (
    prompt: string,
  ) => void | Promise<void>;
}

/**
 * AI chat.
 *
 * @param props - Component properties.
 * @returns AI chat component.
 */
export function AIChat({
  conversation,
  isSending = false,
  onSend,
}: AIChatProps): React.JSX.Element {
  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {conversation?.title ??
            "New Conversation"}
        </h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {conversation
          ?.messages
          .length ? (
          conversation.messages.map(
            (
              message,
            ) => (
              <AIMessage
                key={
                  message.id
                }
                message={
                  message
                }
              />
            ),
          )
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Start a conversation by
            sending a message.
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-6">
        <AIMessageInput
          disabled={
            isSending
          }
          onSend={
            onSend
          }
        />
      </div>
    </div>
  );
}