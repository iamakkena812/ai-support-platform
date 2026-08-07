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
export const ticketPrioritySchema =
  z.enum([
    "low",
    "medium",
    "high",
    "urgent",
  ]);


/**
 * Ticket type schema.
 */
export const ticketTypeSchema =
  z.enum([
    "incident",
    "service_request",
    "bug",
    "task",
    "question",
    "feature_request",
  ]);


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
        3,
        "Title must contain at least 3 characters",
      ),


    /**
     * Ticket description.
     */
    description: z
      .string()
      .min(
        10,
        "Description must contain at least 10 characters",
      ),


    /**
     * Ticket type.
     */
    type: ticketTypeSchema,


    /**
     * Ticket priority.
     */
    priority: ticketPrioritySchema,


    /**
     * Customer identifier.
     */
    customerId: z
      .string()
      .uuid(
        "Invalid customer identifier",
      ),


    /**
     * Project identifier.
     */
    projectId: z
      .string()
      .uuid(
        "Invalid project identifier",
      )
      .nullable()
      .optional(),


    /**
     * Organization identifier.
     */
    organizationId: z
      .string()
      .uuid(
        "Invalid organization identifier",
      )
      .nullable()
      .optional(),


    /**
     * Assignee identifier.
     */
    assigneeId: z
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
        3,
        "Title must contain at least 3 characters",
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
     * Ticket type.
     */
    type:
      ticketTypeSchema.optional(),


    /**
     * Project identifier.
     */
    projectId: z
      .string()
      .uuid(
        "Invalid project identifier",
      )
      .nullable()
      .optional(),


    /**
     * Assignee identifier.
     */
    assigneeId: z
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


    /**
     * Type filter.
     */
    type:
      ticketTypeSchema.optional(),


    /**
     * Customer identifier.
     */
    customerId:
      z.string()
        .uuid()
        .optional(),


    /**
     * Project identifier.
     */
    projectId:
      z.string()
        .uuid()
        .optional(),


    /**
     * Assignee identifier.
     */
    assigneeId:
      z.string()
        .uuid()
        .optional(),

  });