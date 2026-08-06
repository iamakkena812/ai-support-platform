/**
 * Dashboard service.
 *
 * Provides the service layer between the UI and the
 * dashboard API client.
 */

import {
  getAIInsights,
  getDashboard,
  getSystemHealth,
  refreshDashboard,
} from "../api/dashboard.api";

import type {
  DashboardResponse,
  SystemHealth,
  AIInsight,
} from "../types/dashboard.types";

import type {
  DashboardQueryValues,
} from "../schemas/dashboard.schema";

/**
 * Dashboard service.
 */
export const dashboardService = {
  /**
   * Retrieves dashboard data.
   *
   * @param query - Dashboard query parameters.
   * @returns Dashboard response.
   */
  async getDashboard(
    query?: DashboardQueryValues,
  ): Promise<DashboardResponse> {
    return getDashboard(
      query,
    );
  },

  /**
   * Refreshes dashboard data.
   *
   * @returns Dashboard response.
   */
  async refreshDashboard(): Promise<DashboardResponse> {
    return refreshDashboard();
  },

  /**
   * Retrieves current system health.
   *
   * @returns System health information.
   */
  async getSystemHealth(): Promise<SystemHealth> {
    return getSystemHealth();
  },

  /**
   * Retrieves AI insights.
   *
   * @returns AI insights.
   */
  async getAIInsights(): Promise<
    readonly AIInsight[]
  > {
    return getAIInsights();
  },
};