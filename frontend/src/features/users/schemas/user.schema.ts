/**
 * User validation schemas.
 *
 * Mirrors backend/app/users/schemas.py exactly — field names,
 * optionality, and the list-response shape must match what the
 * API actually returns.
 */

import { z } from "zod";


/**
 * User entity schema.
 */
export const UserSchema = z.object({
  id: z.string(),

  organizationId: z.string(),

  email: z.string(),

  username: z.string(),

  fullName: z.string(),

  isActive: z.boolean(),

  isSuperuser: z.boolean(),

  createdAt: z.string(),

  updatedAt: z.string(),
});


/**
 * Create user schema.
 */
export const createUserSchema = z.object({
  organizationId: z.uuid("A valid organization identifier is required."),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(100),

  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required.")
    .max(255),

  email: z
    .string()
    .trim()
    .email("A valid email address is required."),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters."),

  isActive: z.boolean().optional(),

  isSuperuser: z.boolean().optional(),
});


/**
 * Update user schema.
 */
export const updateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(100)
    .optional(),

  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required.")
    .max(255)
    .optional(),

  email: z
    .string()
    .trim()
    .email("A valid email address is required.")
    .optional(),

  isActive: z.boolean().optional(),

  isSuperuser: z.boolean().optional(),
});


/**
 * User filters schema.
 */
export const userFiltersSchema = z.object({
  search: z.string().trim().optional(),

  isActive: z.boolean().optional(),
});


/**
 * User list query schema.
 */
export const userListQuerySchema = z.object({
  page: z.number().int().positive().default(1),

  pageSize: z.number().int().positive().max(100).default(10),
});


/**
 * User list response schema.
 */
export const userListResponseSchema = z.object({
  users: z.array(UserSchema),

  total: z.number(),

  page: z.number(),

  pageSize: z.number(),

  totalPages: z.number(),
});


/**
 * User form schema.
 *
 * Supports both create and update form modes.
 */
export const userFormSchema = z.object({
  organizationId: z.string().optional(),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(100),

  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required.")
    .max(255),

  email: z
    .string()
    .trim()
    .email("A valid email address is required."),

  password: z.string().optional(),

  isActive: z.boolean().optional(),

  isSuperuser: z.boolean().optional(),
});


export type CreateUserFormData = z.infer<typeof createUserSchema>;

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export type UserFilterFormData = z.infer<typeof userFiltersSchema>;

export type UserListQueryFormData = z.infer<typeof userListQuerySchema>;

export type UserSchemaType = z.infer<typeof UserSchema>;
