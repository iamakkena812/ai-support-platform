/**
 * Ticket validation schemas.
 *
 * Defines Zod schemas for
 * ticket forms and API payloads.
 */

import {
  z,
} from "zod";


/**
 * Ticket status schema.
 */
export const ticketStatusSchema =
  z.enum([
    "open",
    "in_progress",
    "pending",
    "resolved",
    "closed",
  ]);


/**
 * Ticket priority schema.
 */
export const ticketPrioritySchema =
  z.enum([
    "low",
    "medium",
    "high",
    "critical",
  ]);


/**
 * Ticket entity schema.
 */
export const ticketSchema =
  z.object({
    id: z.string(),
    organizationId: z.string(),
    createdBy: z.string(),
    title: z.string(),
    description: z.string(),
    status: ticketStatusSchema,
    priority: ticketPrioritySchema,
    assignedTo: z.string().nullish(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  });


/**
 * Ticket list response schema.
 */
export const ticketListResponseSchema =
  z.object({
    items: z.array(ticketSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  });


/**
 * Create ticket validation schema.
 */
export const createTicketSchema =
  z.object({
    /**
     * Ticket title.
     */
    title: z
      .string()
      .min(
        5,
        "Title must contain at least 5 characters",
      )
      .max(
        255,
        "Title cannot exceed 255 characters",
      ),


    /**
     * Ticket description.
     */
    description: z
      .string()
      .min(
        10,
        "Description must contain at least 10 characters",
      )
      .max(
        10000,
        "Description cannot exceed 10000 characters",
      ),


    /**
     * Ticket priority.
     */
    priority: ticketPrioritySchema,


    /**
     * Assignee identifier.
     */
    assignedTo: z
      .string()
      .uuid(
        "Invalid assignee identifier",
      )
      .nullable()
      .optional(),
  });


/**
 * Update ticket validation schema.
 */
export const updateTicketSchema =
  z.object({

    /**
     * Ticket title.
     */
    title: z
      .string()
      .min(
        5,
        "Title must contain at least 5 characters",
      )
      .max(
        255,
        "Title cannot exceed 255 characters",
      )
      .optional(),


    /**
     * Ticket description.
     */
    description: z
      .string()
      .min(
        10,
        "Description must contain at least 10 characters",
      )
      .max(
        10000,
        "Description cannot exceed 10000 characters",
      )
      .optional(),


    /**
     * Ticket status.
     */
    status:
      ticketStatusSchema.optional(),


    /**
     * Ticket priority.
     */
    priority:
      ticketPrioritySchema.optional(),


    /**
     * Assignee identifier.
     */
    assignedTo: z
      .string()
      .uuid(
        "Invalid assignee identifier",
      )
      .nullable()
      .optional(),

  });


/**
 * Ticket filter schema.
 */
export const ticketFilterSchema =
  z.object({

    /**
     * Search term.
     */
    search:
      z.string().optional(),


    /**
     * Status filter.
     */
    status:
      ticketStatusSchema.optional(),


    /**
     * Priority filter.
     */
    priority:
      ticketPrioritySchema.optional(),

  });
