/**
 * AI conversation list component.
 */

import type { FC } from "react";

import type {
  AIConversation,
} from "../types/aiAssistant.types";

/**
 * Component properties.
 */
export interface AIConversationListProps {
  /**
   * Conversations.
   */
  readonly conversations: readonly AIConversation[];

  /**
   * Selected conversation identifier.
   */
  readonly selectedConversationId?: string;

  /**
   * Invoked when a conversation is selected.
   *
   * @param conversation - Selected conversation.
   */
  readonly onSelect?: (
    conversation: AIConversation,
  ) => void;

  /**
   * Invoked when a conversation is deleted.
   *
   * @param conversation - Selected conversation.
   */
  readonly onDelete?: (
    conversation: AIConversation,
  ) => void;
}

/**
 * AI conversation list.
 *
 * @param props - Component properties.
 * @returns AI conversation list component.
 */
export const AIConversationList: FC<
  AIConversationListProps
> = ({
  conversations,
  selectedConversationId,
  onSelect,
  onDelete,
}) => {
  if (
    conversations.length ===
    0
  ) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
        No conversations found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Conversations
        </h2>
      </div>

      <ul className="divide-y divide-gray-200">
        {conversations.map(
          (
            conversation,
          ) => {
            const isSelected =
              conversation.id ===
              selectedConversationId;

            return (
              <li
                key={
                  conversation.id
                }
                className={`flex items-center justify-between px-4 py-3 transition-colors ${
                  isSelected
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    onSelect?.(
                      conversation,
                    )
                  }
                  className="flex-1 text-left"
                >
                  <div className="font-medium text-gray-900">
                    {
                      conversation.title
                    }
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <span className="capitalize">
                      {
                        conversation.status
                      }
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      {
                        conversation.messages
                          .length
                      }
                      {" "}
                      messages
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete?.(
                      conversation,
                    )
                  }
                  className="ml-4 rounded border border-red-300 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </li>
            );
          },
        )}
      </ul>
    </div>
  );
};