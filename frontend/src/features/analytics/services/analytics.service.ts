/**
 * Analytics service.
 *
 * Provides the service layer between the UI and the
 * analytics API client.
 */

import {
  getAnalyticsDashboard,
  getAnalyticsHealth,
  getOrganizationMetrics,
  getSLAMetrics,
  getTicketMetrics,
  getUserMetrics,
  getWorkflowMetrics,
} from "../api/analytics.api";

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
 * Analytics service.
 */
export const analyticsService = {
  /**
   * Retrieves the organization-scoped dashboard summary.
   *
   * @param query - Optional date range filter.
   * @returns Dashboard summary.
   */
  async getDashboard(
    query?: AnalyticsDateRangeQuery,
  ): Promise<AnalyticsDashboard> {
    return getAnalyticsDashboard(query);
  },

  /**
   * Retrieves ticket metrics for the caller's organization.
   *
   * @param query - Optional date range filter.
   * @returns Ticket metrics.
   */
  async getTicketMetrics(
    query?: AnalyticsDateRangeQuery,
  ): Promise<TicketMetrics> {
    return getTicketMetrics(query);
  },

  /**
   * Retrieves user metrics for the caller's organization.
   *
   * @returns User metrics.
   */
  async getUserMetrics(): Promise<UserMetrics> {
    return getUserMetrics();
  },

  /**
   * Retrieves platform-wide organization metrics.
   *
   * @returns Organization metrics.
   */
  async getOrganizationMetrics(): Promise<OrganizationMetrics> {
    return getOrganizationMetrics();
  },

  /**
   * Retrieves workflow metrics for the caller's organization.
   *
   * @returns Workflow metrics.
   */
  async getWorkflowMetrics(): Promise<WorkflowMetrics> {
    return getWorkflowMetrics();
  },

  /**
   * Retrieves SLA metrics for the caller's organization.
   *
   * @param query - Optional date range filter.
   * @returns SLA metrics.
   */
  async getSLAMetrics(
    query?: AnalyticsDateRangeQuery,
  ): Promise<SLAMetrics> {
    return getSLAMetrics(query);
  },

  /**
   * Retrieves analytics module health.
   *
   * @returns Analytics health.
   */
  async getHealth(): Promise<AnalyticsHealth> {
    return getAnalyticsHealth();
  },
};
