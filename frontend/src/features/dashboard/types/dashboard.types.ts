/**
 * Dashboard domain types.
 *
 * Defines the TypeScript models used throughout the
 * Dashboard feature.
 */

/**
 * Dashboard statistics.
 */
export interface DashboardStatistics {
  /**
   * Total organizations.
   */
  readonly totalOrganizations: number;

  /**
   * Total users.
   */
  readonly totalUsers: number;

  /**
   * Total customers.
   */
  readonly totalCustomers: number;

  /**
   * Total projects.
   */
  readonly totalProjects: number;

  /**
   * Total tickets.
   */
  readonly totalTickets: number;

  /**
   * Total attachments.
   */
  readonly totalAttachments: number;

  /**
   * Total notifications.
   */
  readonly totalNotifications: number;

  /**
   * Open tickets.
   */
  readonly openTickets: number;

  /**
   * Closed tickets.
   */
  readonly closedTickets: number;

  /**
   * High priority tickets.
   */
  readonly highPriorityTickets: number;
}

/**
 * Dashboard ticket summary.
 */
export interface DashboardTicket {
  /**
   * Ticket identifier.
   */
  readonly id: string;

  /**
   * Ticket number.
   */
  readonly ticketNumber: string;

  /**
   * Ticket title.
   */
  readonly title: string;

  /**
   * Ticket status.
   */
  readonly status: string;

  /**
   * Ticket priority.
   */
  readonly priority: string;

  /**
   * Created timestamp.
   */
  readonly createdAt: string;
}

/**
 * Dashboard customer summary.
 */
export interface DashboardCustomer {
  /**
   * Customer identifier.
   */
  readonly id: string;

  /**
   * Customer name.
   */
  readonly name: string;

  /**
   * Customer email.
   */
  readonly email: string;

  /**
   * Company name.
   */
  readonly company: string;

  /**
   * Created timestamp.
   */
  readonly createdAt: string;
}

/**
 * Dashboard project summary.
 */
export interface DashboardProject {
  /**
   * Project identifier.
   */
  readonly id: string;

  /**
   * Project name.
   */
  readonly name: string;

  /**
   * Project status.
   */
  readonly status: string;

  /**
   * Progress percentage.
   */
  readonly progress: number;

  /**
   * Start date.
   */
  readonly startDate?: string | null;

  /**
   * End date.
   */
  readonly endDate?: string | null;
}

/**
 * Dashboard notification summary.
 */
export interface DashboardNotification {
  /**
   * Notification identifier.
   */
  readonly id: string;

  /**
   * Notification title.
   */
  readonly title: string;

  /**
   * Notification type.
   */
  readonly type: string;

  /**
   * Read flag.
   */
  readonly isRead: boolean;

  /**
   * Created timestamp.
   */
  readonly createdAt: string;
}

/**
 * System health information.
 */
export interface SystemHealth {
  /**
   * Overall status.
   */
  readonly status:
    | "healthy"
    | "warning"
    | "critical";

  /**
   * API status.
   */
  readonly api: boolean;

  /**
   * Database status.
   */
  readonly database: boolean;

  /**
   * AI services status.
   */
  readonly aiServices: boolean;

  /**
   * Storage status.
   */
  readonly storage: boolean;

  /**
   * Last updated timestamp.
   */
  readonly updatedAt: string;
}

/**
 * AI insight.
 */
export interface AIInsight {
  /**
   * Insight identifier.
   */
  readonly id: string;

  /**
   * Insight title.
   */
  readonly title: string;

  /**
   * Insight description.
   */
  readonly description: string;

  /**
   * Insight severity.
   */
  readonly severity:
    | "low"
    | "medium"
    | "high";

  /**
   * Generated timestamp.
   */
  readonly generatedAt: string;
}

/**
 * Dashboard response.
 */
export interface DashboardResponse {
  /**
   * Dashboard statistics.
   */
  readonly statistics: DashboardStatistics;

  /**
   * Recent tickets.
   */
  readonly recentTickets: readonly DashboardTicket[];

  /**
   * Recent customers.
   */
  readonly recentCustomers: readonly DashboardCustomer[];

  /**
   * Recent projects.
   */
  readonly recentProjects: readonly DashboardProject[];

  /**
   * Recent notifications.
   */
  readonly recentNotifications: readonly DashboardNotification[];

  /**
   * System health.
   */
  readonly systemHealth: SystemHealth;

  /**
   * AI insights.
   */
  readonly aiInsights: readonly AIInsight[];
}

/**
 * Dashboard chart data point.
 */
export interface DashboardChartDataPoint {
  /**
   * Chart label.
   */
  readonly label: string;

  /**
   * Numeric value.
   */
  readonly value: number;
}

/**
 * Dashboard chart.
 */
export interface DashboardChartData {
  /**
   * Chart title.
   */
  readonly title: string;

  /**
   * Data points.
   */
  readonly data: readonly DashboardChartDataPoint[];
}