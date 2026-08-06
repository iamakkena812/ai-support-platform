/**
 * Dashboard statistics component.
 */

import type { DashboardStatistics } from "../types/dashboard.types";

/**
 * Component properties.
 */
export interface DashboardStatsProps {
  /**
   * Dashboard statistics.
   */
  readonly statistics: DashboardStatistics;
}

/**
 * Dashboard statistics.
 *
 * @param props - Component properties.
 * @returns Dashboard statistics component.
 */
export function DashboardStats({
  statistics,
}: DashboardStatsProps): React.JSX.Element {
  const cards = [
    {
      label:
        "Organizations",
      value:
        statistics.totalOrganizations,
    },
    {
      label: "Users",
      value:
        statistics.totalUsers,
    },
    {
      label:
        "Customers",
      value:
        statistics.totalCustomers,
    },
    {
      label:
        "Projects",
      value:
        statistics.totalProjects,
    },
    {
      label:
        "Tickets",
      value:
        statistics.totalTickets,
    },
    {
      label:
        "Open Tickets",
      value:
        statistics.openTickets,
    },
    {
      label:
        "Closed Tickets",
      value:
        statistics.closedTickets,
    },
    {
      label:
        "High Priority",
      value:
        statistics.highPriorityTickets,
    },
    {
      label:
        "Attachments",
      value:
        statistics.totalAttachments,
    },
    {
      label:
        "Notifications",
      value:
        statistics.totalNotifications,
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Overview
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(
          (card) => (
            <div
              key={
                card.label
              }
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-sm font-medium text-gray-500">
                {
                  card.label
                }
              </div>

              <div className="mt-3 text-3xl font-bold text-gray-900">
                {card.value.toLocaleString()}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}