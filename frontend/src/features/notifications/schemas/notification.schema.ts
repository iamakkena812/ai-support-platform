/**
 * Notification validation schemas.
 *
 * Provides Zod schemas and inferred types for
 * notification forms and query validation.
 */

import { z } from "zod";

/**
 * Create notification schema.
 */
export const createNotificationSchema =
  z.object({
    recipientId: z
      .uuid(
        "A valid recipient identifier is required.",
      ),

    title: z
      .string()
      .trim()
      .min(
        1,
        "Title is required.",
      )
      .max(
        200,
        "Title must not exceed 200 characters.",
      ),

    message: z
      .string()
      .trim()
      .min(
        1,
        "Message is required.",
      )
      .max(
        2000,
        "Message must not exceed 2000 characters.",
      ),

    type: z.enum([
      "info",
      "success",
      "warning",
      "error",
    ]),

    actionUrl: z
      .string()
      .trim()
      .url(
        "Action URL must be a valid URL.",
      )
      .optional()
      .or(z.literal("")),
  });

/**
 * Update notification schema.
 */
export const updateNotificationSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        1,
        "Title is required.",
      )
      .max(
        200,
        "Title must not exceed 200 characters.",
      )
      .optional(),

    message: z
      .string()
      .trim()
      .min(
        1,
        "Message is required.",
      )
      .max(
        2000,
        "Message must not exceed 2000 characters.",
      )
      .optional(),

    type: z
      .enum([
        "info",
        "success",
        "warning",
        "error",
      ])
      .optional(),

    status: z
      .enum([
        "unread",
        "read",
      ])
      .optional(),

    actionUrl: z
      .string()
      .trim()
      .url(
        "Action URL must be a valid URL.",
      )
      .optional()
      .or(z.literal("")),
  });

/**
 * Notification filters schema.
 */
export const notificationFiltersSchema =
  z.object({
    search: z
      .string()
      .trim()
      .optional(),

    type: z
      .enum([
        "info",
        "success",
        "warning",
        "error",
      ])
      .optional(),

    status: z
      .enum([
        "unread",
        "read",
      ])
      .optional(),

    recipientId: z
      .uuid()
      .optional(),
  });

/**
 * Notification list query schema.
 */
export const notificationListQuerySchema =
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
 * Create notification form data.
 */
export type CreateNotificationFormData =
  z.infer<
    typeof createNotificationSchema
  >;

/**
 * Update notification form data.
 */
export type UpdateNotificationFormData =
  z.infer<
    typeof updateNotificationSchema
  >;

/**
 * Notification filter form data.
 */
export type NotificationFilterFormData =
  z.infer<
    typeof notificationFiltersSchema
  >;

/**
 * Notification list query form data.
 */
export type NotificationListQueryFormData =
  z.infer<
    typeof notificationListQuerySchema
  >;