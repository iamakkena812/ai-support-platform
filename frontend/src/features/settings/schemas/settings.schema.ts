/**
 * Settings validation schemas.
 */

import { z } from "zod";

/**
 * Theme mode schema.
 */
export const themeModeSchema =
  z.enum([
    "light",
    "dark",
    "system",
  ]);

/**
 * AI provider schema.
 */
export const aiProviderSchema =
  z.enum([
    "openai",
    "azure-openai",
    "anthropic",
    "google",
  ]);

/**
 * Profile settings schema.
 */
export const profileSettingsSchema =
  z.object({
    fullName: z
      .string()
      .trim()
      .min(
        2,
        "Full name is required.",
      )
      .max(
        100,
        "Full name cannot exceed 100 characters.",
      ),

    email: z
      .string()
      .trim()
      .email(
        "Invalid email address.",
      ),

    jobTitle: z
      .string()
      .trim()
      .optional(),

    phoneNumber: z
      .string()
      .trim()
      .optional(),
  });

/**
 * Organization settings schema.
 */
export const organizationSettingsSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Organization name is required.",
      ),

    domain: z
      .string()
      .trim()
      .optional(),

    supportEmail: z
      .string()
      .trim()
      .email(
        "Invalid support email.",
      )
      .optional()
      .or(z.literal("")),

    timeZone: z
      .string()
      .trim()
      .min(
        1,
        "Time zone is required.",
      ),

    language: z
      .string()
      .trim()
      .min(
        1,
        "Language is required.",
      ),
  });

/**
 * Notification settings schema.
 */
export const notificationSettingsSchema =
  z.object({
    emailEnabled:
      z.boolean(),

    browserEnabled:
      z.boolean(),

    aiEnabled:
      z.boolean(),

    ticketEnabled:
      z.boolean(),
  });

/**
 * Security settings schema.
 */
export const securitySettingsSchema =
  z.object({
    mfaEnabled:
      z.boolean(),

    sessionTimeout: z
      .number()
      .int()
      .positive(),

    passwordExpiryDays: z
      .number()
      .int()
      .positive(),
  });

/**
 * AI settings schema.
 */
export const aiSettingsSchema =
  z.object({
    enabled:
      z.boolean(),

    provider:
      aiProviderSchema,

    model: z
      .string()
      .trim()
      .min(
        1,
        "Model is required.",
      ),

    temperature: z
      .number()
      .min(0)
      .max(2),
  });

/**
 * Theme settings schema.
 */
export const themeSettingsSchema =
  z.object({
    mode:
      themeModeSchema,
  });

/**
 * API key settings schema.
 */
export const apiKeySettingsSchema =
  z.object({
    openAIKey:
      z.string().optional(),

    azureOpenAIKey:
      z.string().optional(),

    anthropicKey:
      z.string().optional(),

    googleAIKey:
      z.string().optional(),
  });

/**
 * Update settings schema.
 */
export const updateSettingsSchema =
  z.object({
    profile:
      profileSettingsSchema.optional(),

    organization:
      organizationSettingsSchema.optional(),

    notifications:
      notificationSettingsSchema.optional(),

    security:
      securitySettingsSchema.optional(),

    ai:
      aiSettingsSchema.optional(),

    theme:
      themeSettingsSchema.optional(),

    apiKeys:
      apiKeySettingsSchema.optional(),
  });

/**
 * Profile settings values.
 */
export type ProfileSettingsValues =
  z.infer<
    typeof profileSettingsSchema
  >;

/**
 * Organization settings values.
 */
export type OrganizationSettingsValues =
  z.infer<
    typeof organizationSettingsSchema
  >;

/**
 * Notification settings values.
 */
export type NotificationSettingsValues =
  z.infer<
    typeof notificationSettingsSchema
  >;

/**
 * Security settings values.
 */
export type SecuritySettingsValues =
  z.infer<
    typeof securitySettingsSchema
  >;

/**
 * AI settings values.
 */
export type AISettingsValues =
  z.infer<
    typeof aiSettingsSchema
  >;

/**
 * Theme settings values.
 */
export type ThemeSettingsValues =
  z.infer<
    typeof themeSettingsSchema
  >;

/**
 * API key settings values.
 */
export type APIKeySettingsValues =
  z.infer<
    typeof apiKeySettingsSchema
  >;

/**
 * Update settings values.
 */
export type UpdateSettingsValues =
  z.infer<
    typeof updateSettingsSchema
  >;