/**
 * User validation schemas.
 *
 * Provides Zod schemas and inferred types for
 * user forms, API responses, and query validation.
 */

import { z } from "zod";


/**
 * User entity schema.
 */
export const UserSchema =
  z.object({
    id: z.string(),

    firstName:
      z.string(),

    lastName:
      z.string(),

    fullName:
      z.string(),

    email:
      z.string(),

    phone:
      z.string()
        .nullable()
        .optional(),

    avatarUrl:
      z.string()
        .nullable()
        .optional(),

    status:
      z.enum([
        "active",
        "inactive",
        "suspended",
      ]),

    organization:
      z.object({
        id:
          z.string(),

        name:
          z.string(),
      })
      .nullable()
      .optional(),

    roles:
      z.array(
        z.object({
          id:
            z.string(),

          name:
            z.string(),

          description:
            z.string()
              .nullable()
              .optional(),
        }),
      ),

    lastLoginAt:
      z.string()
        .nullable()
        .optional(),

    createdAt:
      z.string(),

    updatedAt:
      z.string(),
  });


/**
 * Create user schema.
 */
export const createUserSchema =
  z.object({
    organizationId:
      z.uuid(
        "A valid organization identifier is required.",
      ),

    firstName:
      z.string()
        .trim()
        .min(
          1,
          "First name is required.",
        )
        .max(
          100,
          "First name must not exceed 100 characters.",
        ),

    lastName:
      z.string()
        .trim()
        .min(
          1,
          "Last name is required.",
        )
        .max(
          100,
          "Last name must not exceed 100 characters.",
        ),

    email:
      z.string()
        .trim()
        .email(
          "A valid email address is required.",
        ),

    password:
      z.string()
        .min(
          8,
          "Password must contain at least 8 characters.",
        ),

    roleIds:
      z.array(
        z.uuid(),
      )
      .optional(),
  });


/**
 * Update user schema.
 */
export const updateUserSchema =
  z.object({
    firstName:
      z.string()
        .trim()
        .min(
          1,
          "First name is required.",
        )
        .max(
          100,
          "First name must not exceed 100 characters.",
        )
        .optional(),

    lastName:
      z.string()
        .trim()
        .min(
          1,
          "Last name is required.",
        )
        .max(
          100,
          "Last name must not exceed 100 characters.",
        )
        .optional(),

    phone:
      z.string()
        .trim()
        .optional()
        .or(
          z.literal(""),
        ),

    avatarUrl:
      z.string()
        .trim()
        .url(
          "Avatar URL must be a valid URL.",
        )
        .optional()
        .or(
          z.literal(""),
        ),

    status:
      z.enum([
        "active",
        "inactive",
        "suspended",
      ])
      .optional(),

    roleIds:
      z.array(
        z.uuid(),
      )
      .optional(),
  });


/**
 * User filters schema.
 */
export const userFiltersSchema =
  z.object({
    search:
      z.string()
        .trim()
        .optional(),

    organizationId:
      z.uuid()
        .optional(),

    status:
      z.enum([
        "active",
        "inactive",
        "suspended",
      ])
      .optional(),

    role:
      z.enum([
        "admin",
        "manager",
        "agent",
        "customer",
      ])
      .optional(),
  });


/**
 * User list query schema.
 */
export const userListQuerySchema =
  z.object({
    page:
      z.number()
        .int()
        .positive()
        .default(1),

    pageSize:
      z.number()
        .int()
        .positive()
        .max(100)
        .default(10),
  });


/**
 * User list response schema.
 */
export const userListResponseSchema =
  z.object({
    items:
      z.array(
        UserSchema,
      ),

    total:
      z.number(),

    page:
      z.number(),

    pageSize:
      z.number(),

    totalPages:
      z.number(),
  });


/**
 * User statistics schema.
 */
export const userStatisticsSchema =
  z.object({
    total:
      z.number(),

    active:
      z.number(),

    inactive:
      z.number(),

    suspended:
      z.number(),
  });


/**
 * Create user form data.
 */
export type CreateUserFormData =
  z.infer<
    typeof createUserSchema
  >;


/**
 * Update user form data.
 */
export type UpdateUserFormData =
  z.infer<
    typeof updateUserSchema
  >;


/**
 * User filter form data.
 */
export type UserFilterFormData =
  z.infer<
    typeof userFiltersSchema
  >;


/**
 * User list query form data.
 */
export type UserListQueryFormData =
  z.infer<
    typeof userListQuerySchema
  >;


/**
 * User schema type.
 */
export type UserSchemaType =
  z.infer<
    typeof UserSchema
  >;