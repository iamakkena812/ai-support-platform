/**
 * User validation schemas.
 *
 * Contains Zod schemas for
 * user authentication and forms.
 */

import {
  z,
} from "zod";

/**
 * User role schema.
 */
export const userRoleSchema =
  z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "AGENT",
    "USER",
  ]);

/**
 * User status schema.
 */
export const userStatusSchema =
  z.enum([
    "ACTIVE",
    "INACTIVE",
    "PENDING",
    "LOCKED",
    "SUSPENDED",
  ]);

/**
 * User schema.
 *
 * Represents authenticated user data.
 */
export const userSchema =
  z.object({
    /**
     * User identifier.
     */
    id: z.string(),

    /**
     * Full name.
     */
    fullName: z.string(),

    /**
     * Email.
     */
    email: z.string().email(),

    /**
     * Phone.
     */
    phone: z.string().optional(),

    /**
     * User role.
     */
    role: userRoleSchema,

    /**
     * User status.
     */
    status: userStatusSchema,

    /**
     * Organization identifier.
     */
    organizationId:
      z.string().optional(),

    /**
     * Created date.
     */
    createdAt:
      z.string().optional(),

    /**
     * Updated date.
     */
    updatedAt:
      z.string().optional(),
  });

/**
 * User form schema.
 */
export const userFormSchema =
  z.object({
    fullName: z
      .string()
      .min(
        2,
        "Full name must contain at least 2 characters.",
      ),

    email: z
      .string()
      .email(
        "Please enter a valid email address.",
      ),

    phone:
      z.string().optional(),

    role:
      userRoleSchema,

    status:
      userStatusSchema,
  });

/**
 * User schema type.
 */
export type UserSchema =
  z.infer<
    typeof userSchema
  >;

/**
 * User form schema type.
 */
export type UserFormSchema =
  z.infer<
    typeof userFormSchema
  >;

/**
 * Create user schema type.
 */
export type CreateUserSchema =
  UserFormSchema;

/**
 * Update user schema type.
 */
export type UpdateUserSchema =
  Partial<UserFormSchema>;