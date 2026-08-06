/**
 * AI Assistant feature exports.
 */

export * from "./api/aiAssistant.api";

export * from "./components/AIChat";
export * from "./components/AIConversationList";
export * from "./components/AIMessage";
export * from "./components/AIMessageInput";
export * from "./components/AIPromptSuggestions";
export * from "./components/AIResponseSources";
export * from "./components/AIThinkingIndicator";

export * from "./hooks/useAIChat";
export * from "./hooks/useAIConversation";

export * from "./pages/AIAssistantPage";
export * from "./pages/AIConversationPage";

export {
  aiChatRequestSchema,
  aiConversationFilterSchema,
  aiConversationQuerySchema,
  aiConversationStatusSchema,
  aiMessageRoleSchema,
} from "./schemas/aiAssistant.schema";

export type {
  AIChatValues,
  AIConversationFilterValues,
  AIConversationQueryValues,
} from "./schemas/aiAssistant.schema";

export * from "./services/aiAssistant.service";

export type {
  AIChatRequest,
  AIChatResponse,
  AIConversation,
  AIConversationListQuery,
  AIConversationListResponse,
  AIConversationStatus,
  AIMessage,
  AIMessageRole,
  AISourceReference,
} from "./types/aiAssistant.types";

export * from "./utils";