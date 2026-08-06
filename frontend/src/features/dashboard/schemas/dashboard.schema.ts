/**
 * Dashboard validation schemas.
 *
 * Provides Zod schemas and inferred types for
 * dashboard query validation.
 */

import { z } from "zod";

/**
 * Dashboard refresh interval schema.
 */
export const dashboardRefreshIntervalSchema =
  z.enum([
    "off",
    "30s",
    "1m",
    "5m",
    "15m",
  ]);

/**
 * Dashboard date range schema.
 */
export const dashboardDateRangeSchema =
  z.enum([
    "today",
    "7d",
    "30d",
    "90d",
    "1y",
  ]);

/**
 * Dashboard query schema.
 */
export const dashboardQuerySchema =
  z.object({
    /**
     * Selected date range.
     */
    dateRange:
      dashboardDateRangeSchema.default(
        "30d",
      ),

    /**
     * Auto refresh interval.
     */
    refreshInterval:
      dashboardRefreshIntervalSchema.default(
        "off",
      ),
  });

/**
 * Dashboard query values.
 */
export type DashboardQueryValues =
  z.infer<
    typeof dashboardQuerySchema
  >;

/**
 * Dashboard refresh interval.
 */
export type DashboardRefreshInterval =
  z.infer<
    typeof dashboardRefreshIntervalSchema
  >;

/**
 * Dashboard date range.
 */
export type DashboardDateRange =
  z.infer<
    typeof dashboardDateRangeSchema
  >;