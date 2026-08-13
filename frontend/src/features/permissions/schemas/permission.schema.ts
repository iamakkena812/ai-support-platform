/**
 * Permission validation schemas.
 *
 * Mirrors backend/app/permissions/schemas.py exactly.
 */

import { z } from "zod";

/**
 * Permission creation schema.
 */
export const createPermissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Permission name is required")
    .max(100, "Permission name must not exceed 100 characters"),

  resource: z
    .string()
    .trim()
    .min(1, "Resource is required")
    .max(100, "Resource must not exceed 100 characters"),

  action: z
    .string()
    .trim()
    .min(1, "Action is required")
    .max(100, "Action must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(255, "Description must not exceed 255 characters")
    .nullable()
    .optional(),
});

/**
 * Permission update schema.
 */
export const updatePermissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Permission name is required")
    .max(100, "Permission name must not exceed 100 characters")
    .optional(),

  resource: z
    .string()
    .trim()
    .min(1, "Resource is required")
    .max(100, "Resource must not exceed 100 characters")
    .optional(),

  action: z
    .string()
    .trim()
    .min(1, "Action is required")
    .max(100, "Action must not exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(255, "Description must not exceed 255 characters")
    .nullable()
    .optional(),
});

/**
 * Permission filter schema.
 */
export const permissionFilterSchema = z.object({
  search: z
    .string()
    .trim()
    .max(100, "Search text must not exceed 100 characters")
    .optional(),

  resource: z
    .string()
    .trim()
    .max(100, "Resource must not exceed 100 characters")
    .optional(),

  action: z
    .string()
    .trim()
    .max(100, "Action must not exceed 100 characters")
    .optional(),
});

/**
 * Inferred create permission form values.
 */
export type CreatePermissionFormValues = z.infer<
  typeof createPermissionSchema
>;

/**
 * Inferred update permission form values.
 */
export type UpdatePermissionFormValues = z.infer<
  typeof updatePermissionSchema
>;

/**
 * Inferred permission filter values.
 */
export type PermissionFilterFormValues = z.infer<
  typeof permissionFilterSchema
>;
