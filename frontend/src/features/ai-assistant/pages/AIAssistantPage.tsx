/**
 * AI Assistant page.
 */

import {
  useMemo,
  useState,
} from "react";

import { AIChat } from "../components/AIChat";
import { AIConversationList } from "../components/AIConversationList";
import { AIPromptSuggestions } from "../components/AIPromptSuggestions";
import { useAIChat } from "../hooks/useAIChat";
import {
  useAIConversation,
  useAIConversations,
  useDeleteAIConversation,
} from "../hooks/useAIConversation";

/**
 * Default prompt suggestions.
 */
const promptSuggestions = [
  "Summarize today's support tickets.",
  "Show high priority incidents.",
  "Suggest a reply for this customer.",
  "Find similar resolved tickets.",
] as const;

/**
 * AI Assistant page.
 *
 * @returns AI Assistant page component.
 */
export function AIAssistantPage(): React.JSX.Element {
  const [
    selectedConversationId,
    setSelectedConversationId,
  ] = useState("");

  const query = useMemo(
    () => ({
      page: 1,
      pageSize: 20,
    }),
    [],
  );

  const {
    data: conversations,
    isLoading,
    isError,
    error,
  } = useAIConversations(
    query,
  );

  const {
    data: conversation,
  } = useAIConversation(
    selectedConversationId,
  );

  const chatMutation =
    useAIChat();

  const deleteMutation =
    useDeleteAIConversation();

  /**
   * Sends a prompt.
   *
   * @param prompt - User prompt.
   */
  const handleSend = async (
    prompt: string,
  ): Promise<void> => {
    try {
      const response =
        await chatMutation.mutateAsync({
          conversationId:
            selectedConversationId ||
            undefined,
          prompt,
        });

      setSelectedConversationId(
        response.conversation.id,
      );
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
        Loading AI Assistant...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load conversations."}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <aside className="space-y-4">
        <button
          type="button"
          onClick={() => {
            setSelectedConversationId(
              "",
            );
          }}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          New Chat
        </button>

        <AIConversationList
          conversations={
            conversations?.items ??
            []
          }
          selectedConversationId={
            selectedConversationId
          }
          onSelect={(
            conversation,
          ) => {
            setSelectedConversationId(
              conversation.id,
            );
          }}
          onDelete={async (
            conversation,
          ) => {
            try {
              await deleteMutation.mutateAsync(
                conversation.id,
              );

              if (
                conversation.id ===
                selectedConversationId
              ) {
                setSelectedConversationId(
                  "",
                );
              }
            } catch (error) {
              console.error(
                "Failed to delete conversation.",
                error,
              );
            }
          }}
        />
      </aside>

      <main className="space-y-6 lg:col-span-3">
        <AIPromptSuggestions
          prompts={
            promptSuggestions
          }
          onSelect={(
            prompt,
          ) => {
            void handleSend(
              prompt,
            );
          }}
        />

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
      </main>
    </div>
  );
}