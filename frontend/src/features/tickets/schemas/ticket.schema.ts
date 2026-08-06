/**
 * Ticket validation schemas.
 *
 * Provides Zod schemas and inferred types for ticket forms and API payloads.
 */

import { z } from "zod";

/**
 * Ticket status schema.
 */
export const ticketStatusSchema = z.enum([
  "new",
  "open",
  "in_progress",
  "pending",
  "resolved",
  "closed",
]);

/**
 * Ticket priority schema.
 */
export const ticketPrioritySchema = z.enum([
  "low",
  "medium",
  "high",
  "urgent",
]);

/**
 * Ticket type schema.
 */
export const ticketTypeSchema = z.enum([
  "incident",
  "service_request",
  "bug",
  "task",
  "question",
  "feature_request",
]);

/**
 * Ticket creation schema.
 */
export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters.")
    .max(200, "Title cannot exceed 200 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Description must contain at least 10 characters.")
    .max(5000, "Description cannot exceed 5000 characters."),

  type: ticketTypeSchema,

  priority: ticketPrioritySchema,

  customerId: z.uuid(),

  projectId: z
    .uuid()
    .nullable()
    .optional(),

  organizationId: z
    .uuid()
    .nullable()
    .optional(),

  assigneeId: z
    .uuid()
    .nullable()
    .optional(),
});

/**
 * Ticket update schema.
 */
export const updateTicketSchema = createTicketSchema
  .partial()
  .extend({
    status: ticketStatusSchema.optional(),
  });

/**
 * Ticket filter schema.
 */
export const ticketFiltersSchema = z.object({
  search: z.string().trim().optional(),

  status: ticketStatusSchema.optional(),

  priority: ticketPrioritySchema.optional(),

  type: ticketTypeSchema.optional(),

  customerId: z.uuid().optional(),

  projectId: z.uuid().optional(),

  assigneeId: z.uuid().optional(),
});

/**
 * Ticket list query schema.
 */
export const ticketListQuerySchema = z.object({
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
 * Ticket form values.
 */
export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

/**
 * Ticket update values.
 */
export type UpdateTicketFormValues = z.infer<typeof updateTicketSchema>;

/**
 * Ticket filter values.
 */
export type TicketFilterFormData = z.infer<typeof ticketFiltersSchema>;

/**
 * Ticket query values.
 */
export type TicketListQueryValues = z.infer<typeof ticketListQuerySchema>;