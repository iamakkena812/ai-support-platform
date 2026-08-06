/**
 * Organization validation schemas.
 */

import { z } from "zod";

export const organizationSchema = z.object({
  id: z.string(),

  name: z.string(),

  description: z.string().nullable(),

  isActive: z.boolean(),

  createdAt: z.string(),

  updatedAt: z.string(),
});

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Organization name is required.")
    .max(255),

  description: z
    .string()
    .trim()
    .max(1000)
    .nullable()
    .optional(),
});

export const updateOrganizationSchema = z.object({
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

export const organizationResponseSchema = z.object({
  organization: organizationSchema,
});

export const organizationListResponseSchema = z.object({
  items: z.array(organizationSchema),

  total: z.number().nonnegative(),

  page: z.number().nonnegative(),

  size: z.number().positive(),
});

export type Organization = z.infer<typeof organizationSchema>;

export type CreateOrganizationRequest = z.infer<
  typeof createOrganizationSchema
>;

export type UpdateOrganizationRequest = z.infer<
  typeof updateOrganizationSchema
>;

export type OrganizationResponse = z.infer<
  typeof organizationResponseSchema
>;

export type OrganizationListResponse = z.infer<
  typeof organizationListResponseSchema
>;