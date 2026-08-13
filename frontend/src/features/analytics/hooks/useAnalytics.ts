/**
 * React Query hooks for the Analytics feature.
 */

import { useQuery } from "@tanstack/react-query";

import { analyticsService } from "../services/analytics.service";

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
 * Analytics query keys.
 */
export const analyticsQueryKeys = {
  /**
   * Root query key.
   */
  all: ["analytics"] as const,

  /**
   * Dashboard query key.
   *
   * @param query - Date range query.
   * @returns Query key.
   */
  dashboard: (query?: AnalyticsDateRangeQuery) =>
    [...analyticsQueryKeys.all, "dashboard", query] as const,

  /**
   * Ticket metrics query key.
   *
   * @param query - Date range query.
   * @returns Query key.
   */
  tickets: (query?: AnalyticsDateRangeQuery) =>
    [...analyticsQueryKeys.all, "tickets", query] as const,

  /**
   * User metrics query key.
   */
  users: () => [...analyticsQueryKeys.all, "users"] as const,

  /**
   * Organization metrics query key.
   */
  organizations: () =>
    [...analyticsQueryKeys.all, "organizations"] as const,

  /**
   * Workflow metrics query key.
   */
  workflows: () => [...analyticsQueryKeys.all, "workflows"] as const,

  /**
   * SLA metrics query key.
   *
   * @param query - Date range query.
   * @returns Query key.
   */
  sla: (query?: AnalyticsDateRangeQuery) =>
    [...analyticsQueryKeys.all, "sla", query] as const,

  /**
   * Health query key.
   */
  health: () => [...analyticsQueryKeys.all, "health"] as const,
};

/**
 * Retrieves the organization-scoped analytics dashboard.
 *
 * @param query - Optional date range filter.
 * @returns React Query result.
 */
export function useAnalyticsDashboard(
  query?: AnalyticsDateRangeQuery,
) {
  return useQuery<AnalyticsDashboard>({
    queryKey: analyticsQueryKeys.dashboard(query),
    queryFn: () => analyticsService.getDashboard(query),
  });
}

/**
 * Retrieves ticket metrics for the caller's organization.
 *
 * @param query - Optional date range filter.
 * @returns React Query result.
 */
export function useTicketMetrics(
  query?: AnalyticsDateRangeQuery,
) {
  return useQuery<TicketMetrics>({
    queryKey: analyticsQueryKeys.tickets(query),
    queryFn: () => analyticsService.getTicketMetrics(query),
  });
}

/**
 * Retrieves user metrics for the caller's organization.
 *
 * @returns React Query result.
 */
export function useUserMetrics() {
  return useQuery<UserMetrics>({
    queryKey: analyticsQueryKeys.users(),
    queryFn: () => analyticsService.getUserMetrics(),
  });
}

/**
 * Retrieves platform-wide organization metrics.
 *
 * Only meaningful for superusers; callers should gate rendering on
 * `user.isSuperuser` since the backend returns 403 otherwise.
 *
 * @param enabled - Whether the query should run.
 * @returns React Query result.
 */
export function useOrganizationMetrics(enabled: boolean) {
  return useQuery<OrganizationMetrics>({
    queryKey: analyticsQueryKeys.organizations(),
    queryFn: () => analyticsService.getOrganizationMetrics(),
    enabled,
  });
}

/**
 * Retrieves workflow metrics for the caller's organization.
 *
 * @returns React Query result.
 */
export function useWorkflowMetrics() {
  return useQuery<WorkflowMetrics>({
    queryKey: analyticsQueryKeys.workflows(),
    queryFn: () => analyticsService.getWorkflowMetrics(),
  });
}

/**
 * Retrieves SLA metrics for the caller's organization.
 *
 * @param query - Optional date range filter.
 * @returns React Query result.
 */
export function useSLAMetrics(query?: AnalyticsDateRangeQuery) {
  return useQuery<SLAMetrics>({
    queryKey: analyticsQueryKeys.sla(query),
    queryFn: () => analyticsService.getSLAMetrics(query),
  });
}

/**
 * Retrieves analytics module health.
 *
 * @returns React Query result.
 */
export function useAnalyticsHealth() {
  return useQuery<AnalyticsHealth>({
    queryKey: analyticsQueryKeys.health(),
    queryFn: () => analyticsService.getHealth(),
  });
}
