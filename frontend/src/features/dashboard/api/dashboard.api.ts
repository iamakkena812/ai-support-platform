/**
 * Dashboard API client.
 *
 * Provides low-level HTTP operations for retrieving
 * dashboard data.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  DashboardResponse,
} from "../types/dashboard.types";

import type {
  DashboardQueryValues,
} from "../schemas/dashboard.schema";

/**
 * Dashboard API endpoint.
 */
const BASE_PATH =
  "/dashboard";

/**
 * Retrieves dashboard data.
 *
 * @param query - Dashboard query parameters.
 * @returns Dashboard response.
 */
export async function getDashboard(
  query?: DashboardQueryValues,
): Promise<DashboardResponse> {
  const {
    data,
  } =
    await apiClient.get<DashboardResponse>(
      BASE_PATH,
      {
        params:
          query,
      },
    );

  return data;
}

/**
 * Refreshes dashboard data.
 *
 * @returns Dashboard response.
 */
export async function refreshDashboard(): Promise<DashboardResponse> {
  const {
    data,
  } =
    await apiClient.post<DashboardResponse>(
      `${BASE_PATH}/refresh`,
    );

  return data;
}

/**
 * Retrieves current system health.
 *
 * @returns System health.
 */
export async function getSystemHealth(): Promise<
  DashboardResponse["systemHealth"]
> {
  const {
    data,
  } =
    await apiClient.get<
      DashboardResponse["systemHealth"]
    >(
      `${BASE_PATH}/system-health`,
    );

  return data;
}

/**
 * Retrieves AI insights.
 *
 * @returns AI insights.
 */
export async function getAIInsights(): Promise<
  DashboardResponse["aiInsights"]
> {
  const {
    data,
  } =
    await apiClient.get<
      DashboardResponse["aiInsights"]
    >(
      `${BASE_PATH}/ai-insights`,
    );

  return data;
}