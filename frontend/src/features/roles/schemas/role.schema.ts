/**
 * Role validation schemas.
 *
 * Mirrors backend/app/roles/schemas.py exactly.
 */

import { z } from "zod";


/**
 * Create role schema.
 */
export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name must contain at least 2 characters.")
    .max(100, "Role name cannot exceed 100 characters."),

  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters.")
    .nullable()
    .optional(),
});


/**
 * Update role schema.
 */
export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name must contain at least 2 characters.")
    .max(100, "Role name cannot exceed 100 characters.")
    .optional(),

  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters.")
    .nullable()
    .optional(),
});


export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
