/**
 * Customer validation schemas.
 */

import { z } from "zod";

export const customerSchema = z.object({
  id: z.string(),

  organizationId: z.string(),

  firstName: z.string(),

  lastName: z.string(),

  email: z
    .string()
    .email(),

  phone: z
    .string()
    .nullable(),

  company: z
    .string()
    .nullable(),

  isActive: z.boolean(),

  createdAt: z.string(),

  updatedAt: z.string(),
});

export const createCustomerSchema = z.object({
  organizationId: z
    .string()
    .min(
      1,
      "Organization is required.",
    ),

  firstName: z
    .string()
    .trim()
    .min(
      2,
      "First name is required.",
    )
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(
      2,
      "Last name is required.",
    )
    .max(100),

  email: z
    .string()
    .email(
      "Invalid email address.",
    ),

  phone: z
    .string()
    .trim()
    .max(20)
    .nullable()
    .optional(),

  company: z
    .string()
    .trim()
    .max(255)
    .nullable()
    .optional(),
});

export const updateCustomerSchema = z.object({
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

  phone: z
    .string()
    .trim()
    .max(20)
    .nullable()
    .optional(),

  company: z
    .string()
    .trim()
    .max(255)
    .nullable()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export const customerResponseSchema =
  z.object({
    customer: customerSchema,
  });

export const customerListResponseSchema =
  z.object({
    items: z.array(customerSchema),

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

export type CustomerSchema =
  z.infer<
    typeof customerSchema
  >;

export type CreateCustomerSchema =
  z.infer<
    typeof createCustomerSchema
  >;

export type UpdateCustomerSchema =
  z.infer<
    typeof updateCustomerSchema
  >;

export type CustomerResponseSchema =
  z.infer<
    typeof customerResponseSchema
  >;

export type CustomerListResponseSchema =
  z.infer<
    typeof customerListResponseSchema
  >;