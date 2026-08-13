/**
 * Analytics API client.
 *
 * Provides low-level HTTP operations for the
 * Analytics feature.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  AnalyticsDashboard,
  AnalyticsDateRangeQuery,
  AnalyticsHealth,
  OrganizationMetrics,
  SLAMetrics,
  TicketMetrics,
  UserMetrics,
  WorkflowMetrics,
} from "../types/analytics.types";

/**
 * Analytics API base path.
 */
const BASE_PATH = "/analytics";

/**
 * Retrieves the organization-scoped dashboard summary.
 *
 * @param query - Optional date range filter.
 * @returns Dashboard summary.
 */
export async function getAnalyticsDashboard(
  query?: AnalyticsDateRangeQuery,
): Promise<AnalyticsDashboard> {
  const { data } = await apiClient.get<AnalyticsDashboard>(
    `${BASE_PATH}/dashboard`,
    { params: query },
  );

  return data;
}

/**
 * Retrieves ticket metrics for the caller's organization.
 *
 * @param query - Optional date range filter.
 * @returns Ticket metrics.
 */
export async function getTicketMetrics(
  query?: AnalyticsDateRangeQuery,
): Promise<TicketMetrics> {
  const { data } = await apiClient.get<TicketMetrics>(
    `${BASE_PATH}/metrics/tickets`,
    { params: query },
  );

  return data;
}

/**
 * Retrieves user metrics for the caller's organization.
 *
 * @returns User metrics.
 */
export async function getUserMetrics(): Promise<UserMetrics> {
  const { data } = await apiClient.get<UserMetrics>(
    `${BASE_PATH}/metrics/users`,
  );

  return data;
}

/**
 * Retrieves platform-wide organization metrics.
 *
 * Requires superuser privileges; returns 403 otherwise.
 *
 * @returns Organization metrics.
 */
export async function getOrganizationMetrics(): Promise<OrganizationMetrics> {
  const { data } = await apiClient.get<OrganizationMetrics>(
    `${BASE_PATH}/metrics/organizations`,
  );

  return data;
}

/**
 * Retrieves workflow metrics for the caller's organization.
 *
 * @returns Workflow metrics.
 */
export async function getWorkflowMetrics(): Promise<WorkflowMetrics> {
  const { data } = await apiClient.get<WorkflowMetrics>(
    `${BASE_PATH}/metrics/workflows`,
  );

  return data;
}

/**
 * Retrieves SLA metrics for the caller's organization.
 *
 * @param query - Optional date range filter.
 * @returns SLA metrics.
 */
export async function getSLAMetrics(
  query?: AnalyticsDateRangeQuery,
): Promise<SLAMetrics> {
  const { data } = await apiClient.get<SLAMetrics>(
    `${BASE_PATH}/metrics/sla`,
    { params: query },
  );

  return data;
}

/**
 * Retrieves analytics module health.
 *
 * @returns Analytics health.
 */
export async function getAnalyticsHealth(): Promise<AnalyticsHealth> {
  const { data } = await apiClient.get<AnalyticsHealth>(
    `${BASE_PATH}/health`,
  );

  return data;
}
