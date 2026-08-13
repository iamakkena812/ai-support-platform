/**
 * Organization validation schemas.
 *
 * Mirrors backend/app/organizations/schemas.py exactly — field
 * names, optionality, and the list-response shape must match what
 * the API actually returns.
 */

import { z } from "zod";

export const organizationSchema = z.object({
  id: z.string(),

  name: z.string(),

  code: z.string(),

  email: z.string().nullable().optional(),

  phone: z.string().nullable().optional(),

  website: z.string().nullable().optional(),

  logoUrl: z.string().nullable().optional(),

  address: z.string().nullable().optional(),

  city: z.string().nullable().optional(),

  state: z.string().nullable().optional(),

  country: z.string().nullable().optional(),

  postalCode: z.string().nullable().optional(),

  timezone: z.string(),

  isActive: z.boolean(),

  createdAt: z.string(),

  updatedAt: z.string(),
});

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name is required.")
    .max(255),

  code: z
    .string()
    .trim()
    .min(2, "Organization code is required.")
    .max(50),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .nullable()
    .optional()
    .or(z.literal("")),

  phone: z.string().trim().max(25).nullable().optional().or(z.literal("")),

  website: z
    .string()
    .trim()
    .url("Enter a valid URL.")
    .nullable()
    .optional()
    .or(z.literal("")),

  address: z.string().trim().max(500).nullable().optional(),

  city: z.string().trim().max(100).nullable().optional(),

  state: z.string().trim().max(100).nullable().optional(),

  country: z.string().trim().max(100).nullable().optional(),

  postalCode: z.string().trim().max(20).nullable().optional(),

  timezone: z.string().trim().max(100).optional(),
});

export const updateOrganizationSchema = createOrganizationSchema
  .partial()
  .extend({
    isActive: z.boolean().optional(),
  });

export const organizationListResponseSchema = z.object({
  organizations: z.array(organizationSchema),

  total: z.number().nonnegative(),

  page: z.number().nonnegative(),

  pageSize: z.number().positive(),

  totalPages: z.number().nonnegative(),
});

export type Organization = z.infer<typeof organizationSchema>;

export type CreateOrganizationRequest = z.infer<
  typeof createOrganizationSchema
>;

export type UpdateOrganizationRequest = z.infer<
  typeof updateOrganizationSchema
>;

export type OrganizationListResponse = z.infer<
  typeof organizationListResponseSchema
>;
