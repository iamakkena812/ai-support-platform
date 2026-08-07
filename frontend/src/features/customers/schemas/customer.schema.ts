/**
 * Customer validation schemas.
 *
 * Contains Zod schemas for
 * customer forms.
 */

import {
  z,
} from "zod";

/**
 * Customer status schema.
 */
export const customerStatusSchema =
  z.enum([
    "ACTIVE",
    "INACTIVE",
    "PROSPECT",
    "PENDING",
    "SUSPENDED",
    "BLOCKED",
  ]);

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
        2,
        "Customer name must contain at least 2 characters.",
      )
      .max(
        100,
        "Customer name cannot exceed 100 characters.",
      ),

    /**
     * Company.
     */
    company: z
      .string()
      .max(
        150,
        "Company name cannot exceed 150 characters.",
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
        30,
        "Phone number cannot exceed 30 characters.",
      )
      .optional(),

    /**
     * Contact person.
     */
    contactPerson: z
      .string()
      .max(
        100,
        "Contact person cannot exceed 100 characters.",
      )
      .optional(),

    /**
     * Industry.
     */
    industry: z
      .string()
      .max(
        100,
        "Industry cannot exceed 100 characters.",
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