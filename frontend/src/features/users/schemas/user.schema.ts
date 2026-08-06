/**
 * User validation schemas.
 */

import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),

  firstName: z.string(),

  lastName: z.string(),

  email: z.string().email(),

  organizationId: z.string(),

  teamId: z.string().nullable(),

  role: z.string(),

  isActive: z.boolean(),

  createdAt: z.string(),

  updatedAt: z.string(),
});

export const createUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name is required.")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name is required.")
    .max(100),

  email: z
    .string()
    .email("Invalid email address."),

  organizationId: z
    .string()
    .min(1, "Organization is required."),

  teamId: z.string().nullable(),

  role: z
    .string()
    .trim()
    .min(1, "Role is required."),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  email: z
    .string()
    .email()
    .optional(),

  teamId: z
    .string()
    .nullable()
    .optional(),

  role: z
    .string()
    .trim()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export const userResponseSchema = z.object({
  user: userSchema,
});

export const userListResponseSchema = z.object({
  items: z.array(userSchema),

  total: z.number().nonnegative(),

  page: z.number().nonnegative(),

  size: z.number().positive(),
});

export type UserSchema = z.infer<typeof userSchema>;

export type CreateUserSchema = z.infer<
  typeof createUserSchema
>;

export type UpdateUserSchema = z.infer<
  typeof updateUserSchema
>;

export type UserResponseSchema = z.infer<
  typeof userResponseSchema
>;

export type UserListResponseSchema = z.infer<
  typeof userListResponseSchema
>;