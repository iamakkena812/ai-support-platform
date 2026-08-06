/**
 * Attachment validation schemas.
 *
 * Provides Zod schemas and inferred types for
 * attachment forms and API payload validation.
 */

import { z } from "zod";

/**
 * Maximum upload size (25 MB).
 */
const MAX_FILE_SIZE =
  25 * 1024 * 1024;

/**
 * Create attachment schema.
 */
export const createAttachmentSchema =
  z.object({
    ticketId: z
      .uuid(
        "A valid ticket identifier is required.",
      ),

    file: z
      .instanceof(File)
      .refine(
        (file) =>
          file.size <=
          MAX_FILE_SIZE,
        {
          message:
            "File size must not exceed 25 MB.",
        },
      ),
  });

/**
 * Update attachment schema.
 */
export const updateAttachmentSchema =
  z.object({
    fileName: z
      .string()
      .trim()
      .min(
        1,
        "File name is required.",
      )
      .max(
        255,
        "File name must not exceed 255 characters.",
      )
      .optional(),
  });

/**
 * Attachment filters schema.
 */
export const attachmentFiltersSchema =
  z.object({
    search: z
      .string()
      .trim()
      .optional(),

    ticketId: z
      .uuid()
      .optional(),

    contentType: z
      .string()
      .trim()
      .optional(),

    uploadedBy: z
      .string()
      .trim()
      .optional(),
  });

/**
 * Attachment list query schema.
 */
export const attachmentListQuerySchema =
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
 * Create attachment form data.
 */
export type CreateAttachmentFormData =
  z.infer<
    typeof createAttachmentSchema
  >;

/**
 * Update attachment form data.
 */
export type UpdateAttachmentFormData =
  z.infer<
    typeof updateAttachmentSchema
  >;

/**
 * Attachment filter form data.
 */
export type AttachmentFilterFormData =
  z.infer<
    typeof attachmentFiltersSchema
  >;

/**
 * Attachment list query form data.
 */
export type AttachmentListQueryFormData =
  z.infer<
    typeof attachmentListQuerySchema
  >;