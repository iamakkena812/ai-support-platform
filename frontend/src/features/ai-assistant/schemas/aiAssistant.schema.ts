/**
 * AI Assistant validation schemas.
 */

import { z } from "zod";

/**
 * Conversation status schema.
 */
export const aiConversationStatusSchema =
  z.enum([
    "active",
    "archived",
  ]);

/**
 * Message role schema.
 */
export const aiMessageRoleSchema =
  z.enum([
    "system",
    "user",
    "assistant",
  ]);

/**
 * AI chat request schema.
 */
export const aiChatRequestSchema =
  z.object({
    conversationId: z
      .string()
      .uuid()
      .optional(),

    prompt: z
      .string()
      .trim()
      .min(
        1,
        "Prompt is required.",
      )
      .max(
        8000,
        "Prompt cannot exceed 8000 characters.",
      ),
  });

/**
 * Conversation filter schema.
 */
export const aiConversationFilterSchema =
  z.object({
    search: z
      .string()
      .trim()
      .optional(),
  });

/**
 * Conversation query schema.
 */
export const aiConversationQuerySchema =
  z.object({
    page: z
      .number()
      .int()
      .positive()
      .default(1),

    pageSize: z
      .number()
      .int()
      .positive()
      .max(100)
      .default(20),

    search: z
      .string()
      .trim()
      .optional(),
  });

/**
 * AI chat form values.
 */
export type AIChatValues =
  z.infer<
    typeof aiChatRequestSchema
  >;

/**
 * Conversation filter values.
 */
export type AIConversationFilterValues =
  z.infer<
    typeof aiConversationFilterSchema
  >;

/**
 * Conversation query values.
 */
export type AIConversationQueryValues =
  z.infer<
    typeof aiConversationQuerySchema
  >;