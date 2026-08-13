/**
 * Customer validation schemas.
 *
 * Contains Zod schemas for
 * customer forms and API contracts.
 */

import {
  z,
} from "zod";

/**
 * Customer status schema.
 */
export const customerStatusSchema =
  z.enum([
    "active",
    "inactive",
    "suspended",
  ]);

/**
 * Customer type schema.
 */
export const customerTypeSchema =
  z.enum([
    "individual",
    "business",
  ]);

/**
 * Customer entity schema.
 */
export const customerSchema =
  z.object({
    id: z.string(),
    organizationId: z.string(),
    name: z.string(),
    companyName: z.string().nullish(),
    email: z.string(),
    phone: z.string().nullish(),
    website: z.string().nullish(),
    address: z.string().nullish(),
    city: z.string().nullish(),
    state: z.string().nullish(),
    country: z.string().nullish(),
    postalCode: z.string().nullish(),
    customerType: customerTypeSchema,
    status: customerStatusSchema,
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  });

/**
 * Customer list response schema.
 */
export const customerListResponseSchema =
  z.object({
    items: z.array(customerSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  });

/**
 * Create customer schema.
 */
export const createCustomerSchema =
  z.object({
    /**
     * Customer name.
     */
    name: z
      .string()
      .min(
        1,
        "Customer name is required.",
      )
      .max(
        255,
        "Customer name cannot exceed 255 characters.",
      ),

    /**
     * Company name.
     */
    companyName: z
      .string()
      .max(
        255,
        "Company name cannot exceed 255 characters.",
      )
      .optional(),

    /**
     * Email.
     */
    email: z
      .string()
      .email(
        "Please enter a valid email address.",
      ),

    /**
     * Phone.
     */
    phone: z
      .string()
      .max(
        20,
        "Phone number cannot exceed 20 characters.",
      )
      .optional(),

    /**
     * Website.
     */
    website: z
      .string()
      .max(
        255,
        "Website cannot exceed 255 characters.",
      )
      .optional(),

    /**
     * Address.
     */
    address: z
      .string()
      .max(
        500,
        "Address cannot exceed 500 characters.",
      )
      .optional(),

    /**
     * City.
     */
    city: z
      .string()
      .max(
        100,
        "City cannot exceed 100 characters.",
      )
      .optional(),

    /**
     * State.
     */
    state: z
      .string()
      .max(
        100,
        "State cannot exceed 100 characters.",
      )
      .optional(),

    /**
     * Country.
     */
    country: z
      .string()
      .max(
        100,
        "Country cannot exceed 100 characters.",
      )
      .optional(),

    /**
     * Postal code.
     */
    postalCode: z
      .string()
      .max(
        20,
        "Postal code cannot exceed 20 characters.",
      )
      .optional(),

    /**
     * Customer type.
     */
    customerType:
      customerTypeSchema
      .optional(),

    /**
     * Status.
     */
    status:
      customerStatusSchema
      .optional(),
  });

/**
 * Update customer schema.
 */
export const updateCustomerSchema =
  createCustomerSchema.partial();

/**
 * Customer form schema.
 */
export const customerFormSchema =
  createCustomerSchema;

/**
 * Customer form values.
 */
export type CustomerFormSchema =
  z.infer<
    typeof customerFormSchema
  >;

/**
 * Create customer values.
 */
export type CreateCustomerSchema =
  z.infer<
    typeof createCustomerSchema
  >;

/**
 * Update customer values.
 */
export type UpdateCustomerSchema =
  z.infer<
    typeof updateCustomerSchema
  >;
