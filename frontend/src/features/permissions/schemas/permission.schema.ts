/**
 * Permission validation schemas.
 *
 * Defines runtime validation schemas for permission
 * creation, updates, and filtering.
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

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .nullable()
    .optional(),

  groupId: z
    .string()
    .uuid("Invalid permission group identifier")
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

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .nullable()
    .optional(),

  groupId: z
    .string()
    .uuid("Invalid permission group identifier")
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

  groupId: z
    .string()
    .uuid("Invalid permission group identifier")
    .optional(),

  resource: z
    .string()
    .trim()
    .max(100, "Resource must not exceed 100 characters")
    .optional(),
});

/**
 * Role permission mapping schema.
 */
export const rolePermissionMappingSchema = z.object({
  permissionIds: z
    .array(z.string().uuid("Invalid permission identifier"))
    .max(500, "A role cannot have more than 500 permissions"),
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

/**
 * Inferred role permission mapping values.
 */
export type RolePermissionMappingFormValues = z.infer<
  typeof rolePermissionMappingSchema
>;