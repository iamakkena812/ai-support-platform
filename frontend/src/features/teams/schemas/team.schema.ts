/**
 * Team validation schemas.
 */

import { z } from "zod";

export const teamSchema = z.object({
  id: z.string(),

  name: z.string(),

  description: z.string().nullable().optional(),

  organizationId: z.string(),

  isActive: z.boolean(),

  createdAt: z.string(),

  updatedAt: z.string(),
});

export const createTeamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Team name is required.")
    .max(255),

  description: z
    .string()
    .trim()
    .max(1000)
    .nullable()
    .optional(),

  organizationId: z
    .string()
    .min(1, "Organization is required."),
});

export const updateTeamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .max(255)
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000)
    .nullable()
    .optional(),

  isActive: z.boolean().optional(),
});

export const teamResponseSchema = z.object({
  team: teamSchema,
});

export const teamListResponseSchema = z.object({
  items: z.array(teamSchema),

  total: z.number().nonnegative(),

  page: z.number().nonnegative(),

  size: z.number().positive(),
});

export type TeamSchema = z.infer<
  typeof teamSchema
>;

export type CreateTeamSchema = z.infer<
  typeof createTeamSchema
>;

export type UpdateTeamSchema = z.infer<
  typeof updateTeamSchema
>;

export type TeamResponseSchema = z.infer<
  typeof teamResponseSchema
>;

export type TeamListResponseSchema = z.infer<
  typeof teamListResponseSchema
>;