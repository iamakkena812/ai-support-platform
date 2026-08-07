/**
 * Role validation schemas.
 *
 * Provides Zod schemas used for
 * role forms and validation.
 */

import {
  z,
} from "zod";



/**
 * Role status values.
 */
export const roleStatusSchema =
  z.enum(
    [
      "ACTIVE",
      "INACTIVE",
      "ARCHIVED",
    ],
  );



/**
 * Create role schema.
 */
export const createRoleSchema =
  z.object({

    name:
      z
        .string()
        .min(
          2,
          "Role name must contain at least 2 characters.",
        )
        .max(
          100,
          "Role name cannot exceed 100 characters.",
        ),


    description:
      z
        .string()
        .max(
          500,
          "Description cannot exceed 500 characters.",
        )
        .nullable()
        .optional(),


    permissionIds:
      z
        .array(
          z.string(),
        )
        .optional(),

  });



/**
 * Update role schema.
 */
export const updateRoleSchema =
  z.object({

    name:
      z
        .string()
        .min(
          2,
          "Role name must contain at least 2 characters.",
        )
        .max(
          100,
          "Role name cannot exceed 100 characters.",
        )
        .optional(),


    description:
      z
        .string()
        .max(
          500,
          "Description cannot exceed 500 characters.",
        )
        .nullable()
        .optional(),


    status:
      roleStatusSchema
        .optional(),


    permissionIds:
      z
        .array(
          z.string(),
        )
        .optional(),

  });



/**
 * Create role form values.
 */
export type CreateRoleFormValues =
  z.infer<
    typeof createRoleSchema
  >;



/**
 * Update role form values.
 */
export type UpdateRoleFormValues =
  z.infer<
    typeof updateRoleSchema
  >;