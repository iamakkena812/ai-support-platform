/**
 * Team validation schemas.
 *
 * Provides Zod schemas and inferred types for
 * team forms, API responses, and query validation.
 */

import { z } from "zod";


/**
 * Create team schema.
 */
export const createTeamSchema =
  z.object({

    organizationId:
      z
        .uuid(
          "A valid organization identifier is required.",
        ),


    name:
      z
        .string()
        .trim()
        .min(
          1,
          "Team name is required.",
        )
        .max(
          150,
          "Team name must not exceed 150 characters.",
        ),


    description:
      z
        .string()
        .trim()
        .max(
          1000,
          "Description must not exceed 1000 characters.",
        )
        .nullable()
        .optional(),


    leaderId:
      z
        .uuid(
          "Leader identifier must be valid.",
        )
        .optional(),


    memberIds:
      z
        .array(
          z.uuid(),
        )
        .optional(),

  });


/**
 * Update team schema.
 */
export const updateTeamSchema =
  z.object({

    name:
      z
        .string()
        .trim()
        .min(
          1,
          "Team name is required.",
        )
        .max(
          150,
          "Team name must not exceed 150 characters.",
        )
        .optional(),


    description:
      z
        .string()
        .trim()
        .max(
          1000,
          "Description must not exceed 1000 characters.",
        )
        .nullable()
        .optional(),


    status:
      z
        .enum([
          "active",
          "inactive",
          "archived",
        ])
        .optional(),


    leaderId:
      z
        .uuid(
          "Leader identifier must be valid.",
        )
        .optional(),


    memberIds:
      z
        .array(
          z.uuid(),
        )
        .optional(),

  });


/**
 * Team filters schema.
 */
export const teamFiltersSchema =
  z.object({

    search:
      z
        .string()
        .trim()
        .optional(),


    organizationId:
      z
        .uuid()
        .optional(),


    status:
      z
        .enum([
          "active",
          "inactive",
          "archived",
        ])
        .optional(),

  });


/**
 * Team list query schema.
 */
export const teamListQuerySchema =
  z.object({

    page:
      z
        .number()
        .int()
        .positive()
        .default(1),


    pageSize:
      z
        .number()
        .int()
        .positive()
        .max(100)
        .default(10),

  });


/**
 * Team response schema.
 */
export const teamResponseSchema =
  z.object({

    id:
      z.string(),


    name:
      z.string(),


    description:
      z
        .string()
        .nullable()
        .optional(),


    status:
      z.enum([
        "active",
        "inactive",
        "archived",
      ]),


    organization:
      z
        .object({
          id:
            z.string(),

          name:
            z.string(),
        })
        .nullable()
        .optional(),


    leader:
      z
        .object({

          id:
            z.string(),

          name:
            z.string(),

          email:
            z.string(),

        })
        .nullable()
        .optional(),


    members:
      z.array(
        z.object({

          id:
            z.string(),

          user:
            z.object({

              id:
                z.string(),

              name:
                z.string(),

              email:
                z.string(),

            }),

          role:
            z.enum([
              "leader",
              "member",
            ]),

          joinedAt:
            z
              .string()
              .nullable()
              .optional(),

        }),
      ),


    projects:
      z.array(
        z.object({

          id:
            z.string(),

          name:
            z.string(),

        }),
      ),


    createdAt:
      z.string(),


    updatedAt:
      z.string(),

  });


/**
 * Team list response schema.
 */
export const teamListResponseSchema =
  z.object({

    items:
      z.array(
        teamResponseSchema,
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
 * Team statistics schema.
 */
export const teamStatisticsSchema =
  z.object({

    total:
      z.number(),


    active:
      z.number(),


    inactive:
      z.number(),


    archived:
      z.number(),

  });


/**
 * Create team form data.
 */
export type CreateTeamFormData =
  z.infer<
    typeof createTeamSchema
  >;


/**
 * Update team form data.
 */
export type UpdateTeamFormData =
  z.infer<
    typeof updateTeamSchema
  >;


/**
 * Team filter form data.
 */
export type TeamFilterFormData =
  z.infer<
    typeof teamFiltersSchema
  >;


/**
 * Team list query form data.
 */
export type TeamListQueryFormData =
  z.infer<
    typeof teamListQuerySchema
  >;