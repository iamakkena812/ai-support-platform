/**
 * Project validation schemas.
 *
 * Provides Zod schemas and inferred types for
 * project forms, API responses, and query validation.
 */

import {
  z,
} from "zod";


/**
 * Create project schema.
 */
export const createProjectSchema =
  z.object({

    organizationId:
      z.uuid(
        "A valid organization identifier is required.",
      ),


    name:
      z
        .string()
        .trim()
        .min(
          1,
          "Project name is required.",
        )
        .max(
          200,
          "Project name must not exceed 200 characters.",
        ),


    description:
      z
        .string()
        .trim()
        .nullable()
        .optional(),


    priority:
      z.enum([
        "low",
        "medium",
        "high",
        "critical",
      ]),


    teamIds:
      z
        .array(
          z.uuid(),
        )
        .optional(),


    memberIds:
      z
        .array(
          z.uuid(),
        )
        .optional(),


    startDate:
      z
        .string()
        .nullable()
        .optional(),


    endDate:
      z
        .string()
        .nullable()
        .optional(),

  });


/**
 * Update project schema.
 */
export const updateProjectSchema =
  z.object({

    name:
      z
        .string()
        .trim()
        .min(
          1,
          "Project name is required.",
        )
        .max(
          200,
          "Project name must not exceed 200 characters.",
        )
        .optional(),


    description:
      z
        .string()
        .trim()
        .nullable()
        .optional(),


    status:
      z.enum([
        "active",
        "inactive",
        "archived",
        "completed",
      ])
      .optional(),


    priority:
      z.enum([
        "low",
        "medium",
        "high",
        "critical",
      ])
      .optional(),


    teamIds:
      z
        .array(
          z.uuid(),
        )
        .optional(),


    memberIds:
      z
        .array(
          z.uuid(),
        )
        .optional(),


    startDate:
      z
        .string()
        .nullable()
        .optional(),


    endDate:
      z
        .string()
        .nullable()
        .optional(),

  });


/**
 * Project filters schema.
 */
export const projectFiltersSchema =
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
      z.enum([
        "active",
        "inactive",
        "archived",
        "completed",
      ])
      .optional(),


    priority:
      z.enum([
        "low",
        "medium",
        "high",
        "critical",
      ])
      .optional(),

  });


/**
 * Project list query schema.
 */
export const projectListQuerySchema =
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
 * Project response schema.
 */
export const projectResponseSchema =
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
        "completed",
      ]),


    priority:
      z.enum([
        "low",
        "medium",
        "high",
        "critical",
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


    teams:
      z.array(

        z.object({

          id:
            z.string(),

          name:
            z.string(),

        }),

      ),


    members:
      z.array(

        z.object({

          id:
            z.string(),

          name:
            z.string(),

          email:
            z.string(),

        }),

      ),


    owner:
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


    startDate:
      z
        .string()
        .nullable()
        .optional(),


    endDate:
      z
        .string()
        .nullable()
        .optional(),


    createdAt:
      z.string(),


    updatedAt:
      z.string(),

  });


/**
 * Project list response schema.
 */
export const projectListResponseSchema =
  z.object({

    items:
      z.array(
        projectResponseSchema,
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
 * Project statistics schema.
 */
export const projectStatisticsSchema =
  z.object({

    total:
      z.number(),


    active:
      z.number(),


    completed:
      z.number(),


    archived:
      z.number(),

  });


/**
 * Create project form data.
 */
export type CreateProjectFormData =
  z.infer<
    typeof createProjectSchema
  >;


/**
 * Update project form data.
 */
export type UpdateProjectFormData =
  z.infer<
    typeof updateProjectSchema
  >;


/**
 * Project filter form data.
 */
export type ProjectFilterFormData =
  z.infer<
    typeof projectFiltersSchema
  >;


/**
 * Project list query form data.
 */
export type ProjectListQueryFormData =
  z.infer<
    typeof projectListQuerySchema
  >;