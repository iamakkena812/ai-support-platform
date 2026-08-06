/**
 * AI message component.
 */

import { AIResponseSources } from "./AIResponseSources";
import { AIThinkingIndicator } from "./AIThinkingIndicator";

import type {
  AIMessage as AIMessageModel,
} from "../types/aiAssistant.types";

/**
 * Component properties.
 */
export interface AIMessageProps {
  /**
   * Message.
   */
  readonly message: AIMessageModel;
}

/**
 * AI message.
 *
 * @param props - Component properties.
 * @returns AI message component.
 */
export function AIMessage({
  message,
}: AIMessageProps): React.JSX.Element {
  const isUser =
    message.role ===
    "user";

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-3xl rounded-lg px-4 py-3 shadow-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-gray-200 bg-white text-gray-900"
        }`}
      >
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
            {message.role}
          </span>

          <span className="text-xs opacity-70">
            {new Date(
              message.createdAt,
            ).toLocaleTimeString()}
          </span>
        </div>

        <div className="whitespace-pre-wrap break-words text-sm leading-6">
          {message.content}
        </div>

        {!isUser &&
        message.streaming ? (
          <div className="mt-4">
            <AIThinkingIndicator />
          </div>
        ) : null}

        {!isUser &&
        message.sources.length >
          0 ? (
          <div className="mt-4">
            <AIResponseSources
              sources={
                message.sources
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}