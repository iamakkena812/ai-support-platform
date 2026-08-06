/**
 * Comment validation schemas.
 *
 * Provides Zod schemas and inferred types for comment
 * forms and API payload validation.
 */

import { z } from "zod";

/**
 * Create comment schema.
 */
export const createCommentSchema = z.object({
  ticketId: z
    .uuid("A valid ticket identifier is required."),

  content: z
    .string()
    .trim()
    .min(
      1,
      "Comment content is required.",
    )
    .max(
      5000,
      "Comment cannot exceed 5000 characters.",
    ),

  isInternal: z.boolean(),
});

/**
 * Update comment schema.
 */
export const updateCommentSchema =
  createCommentSchema
    .omit({
      ticketId: true,
    })
    .partial();

/**
 * Comment filters schema.
 */
export const commentFiltersSchema =
  z.object({
    search: z
      .string()
      .trim()
      .optional(),

    ticketId: z
      .uuid()
      .optional(),

    authorId: z
      .uuid()
      .optional(),

    isInternal: z
      .boolean()
      .optional(),
  });

/**
 * Comment list query schema.
 */
export const commentListQuerySchema =
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
  });

/**
 * Create comment form data.
 */
export type CreateCommentFormData =
  z.infer<
    typeof createCommentSchema
  >;

/**
 * Update comment form data.
 */
export type UpdateCommentFormData =
  z.infer<
    typeof updateCommentSchema
  >;

/**
 * Comment filter form data.
 */
export type CommentFilterFormData =
  z.infer<
    typeof commentFiltersSchema
  >;

/**
 * Comment list query form data.
 */
export type CommentListQueryFormData =
  z.infer<
    typeof commentListQuerySchema
  >;