/**
 * Analytics domain types.
 *
 * Mirrors the backend analytics response contract
 * (`app/analytics/schemas.py`).
 */

/**
 * Ticket metrics for the caller's organization.
 */
export interface TicketMetrics {
  /**
   * Total tickets.
   */
  readonly total: number;

  /**
   * Ticket counts grouped by status.
   */
  readonly byStatus: Readonly<Record<string, number>>;

  /**
   * Ticket counts grouped by priority.
   */
  readonly byPriority: Readonly<Record<string, number>>;
}

/**
 * User metrics for the caller's organization.
 */
export interface UserMetrics {
  readonly total: number;
  readonly active: number;
  readonly inactive: number;
}

/**
 * Platform-wide organization metrics.
 *
 * Only available to superusers.
 */
export interface OrganizationMetrics {
  readonly total: number;
  readonly active: number;
}

/**
 * Workflow metrics for the caller's organization.
 */
export interface WorkflowMetrics {
  readonly total: number;
  readonly active: number;
  readonly inactive: number;
}

/**
 * SLA metrics for the caller's organization.
 */
export interface SLAMetrics {
  readonly policies: number;
  readonly breaches: number;
  readonly compliancePercentage: number;
}

/**
 * Organization-scoped analytics dashboard summary.
 */
export interface AnalyticsDashboard {
  readonly users: number;
  readonly activeUsers: number;
  readonly projects: number;
  readonly tickets: TicketMetrics;
  readonly workflows: WorkflowMetrics;
  readonly sla: SLAMetrics;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
}

/**
 * Analytics module health.
 */
export interface AnalyticsHealth {
  readonly database: boolean;
  readonly dashboard: boolean;
  readonly metrics: boolean;
}

/**
 * Date range preset.
 */
export type AnalyticsDateRangePreset =
  | "7d"
  | "30d"
  | "90d"
  | "custom";

/**
 * Analytics filter state.
 */
export interface AnalyticsFilterState {
  /**
   * Selected date range preset.
   */
  readonly preset: AnalyticsDateRangePreset;

  /**
   * Custom start date (ISO date string), used when preset is "custom".
   */
  readonly startDate?: string;

  /**
   * Custom end date (ISO date string), used when preset is "custom".
   */
  readonly endDate?: string;
}

/**
 * Resolved date range query sent to the backend.
 */
export interface AnalyticsDateRangeQuery {
  readonly startDate?: string;
  readonly endDate?: string;
}
