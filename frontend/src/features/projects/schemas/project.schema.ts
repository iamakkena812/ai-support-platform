/**
 * Project validation schemas.
 */

import { z } from "zod";

import type {
  CreateProjectRequest,
  Project,
  ProjectListResponse,
  ProjectResponse,
  ProjectStatus,
  UpdateProjectRequest,
} from "../types/project.types";

/**
 * Project status schema.
 */
export const projectStatusSchema: z.ZodType<ProjectStatus> =
  z.enum([
    "planning",
    "active",
    "on_hold",
    "completed",
    "cancelled",
  ]);

/**
 * Project schema.
 */
export const projectSchema: z.ZodType<Project> =
  z.object({
    id: z.string(),

    name: z.string(),

    description: z.string().nullable(),

    organizationId: z.string(),

    customerId: z.string(),

    ownerId: z.string().nullable(),

    status: projectStatusSchema,

    startDate: z.string().nullable(),

    endDate: z.string().nullable(),

    createdAt: z.string(),

    updatedAt: z.string(),
  });

/**
 * Create project schema.
 */
export const createProjectSchema: z.ZodType<CreateProjectRequest> =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Project name is required.",
      )
      .max(200),

    description:
      z.string().nullable(),

    organizationId: z
      .string()
      .min(
        1,
        "Organization is required.",
      ),

    customerId: z
      .string()
      .min(
        1,
        "Customer is required.",
      ),

    ownerId:
      z.string().nullable(),

    status:
      projectStatusSchema,

    startDate:
      z.string().nullable(),

    endDate:
      z.string().nullable(),
  });

/**
 * Update project schema.
 */
export const updateProjectSchema: z.ZodType<UpdateProjectRequest> =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(200)
      .optional(),

    description: z
      .string()
      .nullable()
      .optional(),

    customerId:
      z.string().optional(),

    ownerId: z
      .string()
      .nullable()
      .optional(),

    status:
      projectStatusSchema.optional(),

    startDate: z
      .string()
      .nullable()
      .optional(),

    endDate: z
      .string()
      .nullable()
      .optional(),
  });

/**
 * Project response schema.
 */
export const projectResponseSchema: z.ZodType<ProjectResponse> =
  z.object({
    project: projectSchema,
  });

/**
 * Project list response schema.
 */
export const projectListResponseSchema: z.ZodType<ProjectListResponse> =
  z.object({
    items: z.array(projectSchema),

    total: z
      .number()
      .nonnegative(),

    page: z
      .number()
      .nonnegative(),

    size: z
      .number()
      .positive(),
  });

export type ProjectStatusSchema =
  z.infer<typeof projectStatusSchema>;

export type ProjectSchema =
  z.infer<typeof projectSchema>;

export type CreateProjectSchema =
  z.infer<typeof createProjectSchema>;

export type UpdateProjectSchema =
  z.infer<typeof updateProjectSchema>;

export type ProjectResponseSchema =
  z.infer<typeof projectResponseSchema>;

export type ProjectListResponseSchema =
  z.infer<typeof projectListResponseSchema>;