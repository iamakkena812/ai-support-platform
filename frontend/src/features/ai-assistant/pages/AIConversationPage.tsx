/**
 * AI conversation page.
 */

import {
  useParams,
} from "react-router-dom";

import { AIChat } from "../components/AIChat";
import { useAIChat } from "../hooks/useAIChat";
import {
  useAIConversation,
} from "../hooks/useAIConversation";

/**
 * AI conversation page.
 *
 * @returns AI conversation page component.
 */
export function AIConversationPage(): React.JSX.Element {
  const {
    conversationId = "",
  } = useParams<{
    conversationId: string;
  }>();

  const {
    data: conversation,
    isLoading,
    isError,
    error,
  } = useAIConversation(
    conversationId,
  );

  const chatMutation =
    useAIChat();

  /**
   * Sends a prompt.
   *
   * @param prompt - User prompt.
   */
  const handleSend = async (
    prompt: string,
  ): Promise<void> => {
    if (
      conversationId.length === 0
    ) {
      return;
    }

    try {
      await chatMutation.mutateAsync({
        conversationId,
        prompt,
      });
    } catch (error) {
      console.error(
        "Failed to send prompt.",
        error,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading conversation...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load conversation."}
      </div>
    );
  }

  if (conversation == null) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Conversation not found.
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)]">
      <AIChat
        conversation={
          conversation
        }
        isSending={
          chatMutation.isPending
        }
        onSend={
          handleSend
        }
      />
    </div>
  );
}