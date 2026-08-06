/**
 * React Query hooks for the Dashboard feature.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { dashboardService } from "../services/dashboard.service";

import type {
  DashboardResponse,
  AIInsight,
  SystemHealth,
} from "../types/dashboard.types";

import type {
  DashboardQueryValues,
} from "../schemas/dashboard.schema";

/**
 * Dashboard query keys.
 */
export const dashboardQueryKeys = {
  /**
   * Root query key.
   */
  all: ["dashboard"] as const,

  /**
   * Dashboard query key.
   *
   * @param query - Dashboard query.
   * @returns Query key.
   */
  dashboard: (
    query?: DashboardQueryValues,
  ) =>
    [
      ...dashboardQueryKeys.all,
      "dashboard",
      query,
    ] as const,

  /**
   * System health query key.
   */
  systemHealth: () =>
    [
      ...dashboardQueryKeys.all,
      "system-health",
    ] as const,

  /**
   * AI insights query key.
   */
  aiInsights: () =>
    [
      ...dashboardQueryKeys.all,
      "ai-insights",
    ] as const,
};

/**
 * Retrieves dashboard data.
 *
 * @param query - Dashboard query.
 * @returns React Query result.
 */
export function useDashboard(
  query?: DashboardQueryValues,
) {
  return useQuery<DashboardResponse>({
    queryKey:
      dashboardQueryKeys.dashboard(
        query,
      ),

    queryFn: () =>
      dashboardService.getDashboard(
        query,
      ),
  });
}

/**
 * Retrieves system health.
 *
 * @returns React Query result.
 */
export function useSystemHealth() {
  return useQuery<SystemHealth>({
    queryKey:
      dashboardQueryKeys.systemHealth(),

    queryFn: () =>
      dashboardService.getSystemHealth(),
  });
}

/**
 * Retrieves AI insights.
 *
 * @returns React Query result.
 */
export function useAIInsights() {
  return useQuery<
    readonly AIInsight[]
  >({
    queryKey:
      dashboardQueryKeys.aiInsights(),

    queryFn: () =>
      dashboardService.getAIInsights(),
  });
}

/**
 * Refreshes dashboard data.
 *
 * @returns Mutation.
 */
export function useRefreshDashboard() {
  const queryClient =
    useQueryClient();

  return useMutation<
    DashboardResponse,
    Error,
    void
  >({
    mutationFn: () =>
      dashboardService.refreshDashboard(),

    onSuccess: async () => {
      await queryClient.invalidateQueries(
        {
          queryKey:
            dashboardQueryKeys.all,
        },
      );
    },
  });
}