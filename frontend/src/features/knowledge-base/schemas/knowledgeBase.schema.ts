/**
 * Knowledge Base validation schemas.
 */

import { z } from "zod";

/**
 * Article status schema.
 */
export const knowledgeArticleStatusSchema =
  z.enum([
    "draft",
    "published",
    "archived",
  ]);

/**
 * Create knowledge article schema.
 */
export const createKnowledgeArticleSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        3,
        "Title must contain at least 3 characters.",
      )
      .max(
        200,
        "Title cannot exceed 200 characters.",
      ),

    content: z
      .string()
      .trim()
      .min(
        10,
        "Content must contain at least 10 characters.",
      ),

    summary: z
      .string()
      .trim()
      .max(
        500,
        "Summary cannot exceed 500 characters.",
      )
      .optional(),

    categoryId: z
      .string()
      .uuid(
        "Invalid category identifier.",
      ),

    tags: z
      .array(
        z.string().trim(),
      )
      .default([]),

    status:
      knowledgeArticleStatusSchema,
  });

/**
 * Knowledge Base filter schema.
 */
export const knowledgeFilterSchema =
  z.object({
    search: z
      .string()
      .trim()
      .optional(),

    categoryId: z
      .string()
      .uuid()
      .optional(),

    status:
      knowledgeArticleStatusSchema.optional(),
  });

/**
 * Knowledge Base query schema.
 */
export const knowledgeQuerySchema =
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
      .default(10),

    filters:
      knowledgeFilterSchema.default(
        {},
      ),
  });

/**
 * Create article form values.
 */
export type CreateKnowledgeArticleValues =
  z.infer<
    typeof createKnowledgeArticleSchema
  >;

/**
 * Filter values.
 */
export type KnowledgeFilterValues =
  z.infer<
    typeof knowledgeFilterSchema
  >;

/**
 * Query values.
 */
export type KnowledgeQueryValues =
  z.infer<
    typeof knowledgeQuerySchema
  >;