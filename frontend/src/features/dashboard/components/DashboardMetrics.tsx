/**
 * Dashboard metrics component.
 *
 * Displays the dashboard KPI cards.
 */

import {
  Building2,
  FolderKanban,
  Paperclip,
  Ticket,
  Users,
  UserRound,
  Bell,
  AlertTriangle,
} from "lucide-react";

import type {
  DashboardStatistics,
} from "../types/dashboard.types";

import {
  DashboardGrid,
} from "./DashboardGrid";

import {
  StatCard,
} from "./StatCard";

/**
 * Component properties.
 */
export interface DashboardMetricsProps {
  /**
   * Dashboard statistics.
   */
  readonly statistics: DashboardStatistics;
}

/**
 * Dashboard metrics.
 *
 * @param props Component properties.
 * @returns Dashboard metrics component.
 */
export function DashboardMetrics({
  statistics,
}: DashboardMetricsProps): React.JSX.Element {
  return (
    <DashboardGrid>
      <StatCard
        title="Organizations"
        value={
          statistics.totalOrganizations
        }
        icon={
          <Building2 size={22} />
        }
      />

      <StatCard
        title="Users"
        value={
          statistics.totalUsers
        }
        icon={
          <Users size={22} />
        }
      />

      <StatCard
        title="Customers"
        value={
          statistics.totalCustomers
        }
        icon={
          <UserRound size={22} />
        }
      />

      <StatCard
        title="Projects"
        value={
          statistics.totalProjects
        }
        icon={
          <FolderKanban size={22} />
        }
      />

      <StatCard
        title="Tickets"
        value={
          statistics.totalTickets
        }
        icon={
          <Ticket size={22} />
        }
      />

      <StatCard
        title="Open Tickets"
        value={
          statistics.openTickets
        }
        icon={
          <AlertTriangle
            size={22}
          />
        }
      />

      <StatCard
        title="Closed Tickets"
        value={
          statistics.closedTickets
        }
        icon={
          <Ticket size={22} />
        }
      />

      <StatCard
        title="Attachments"
        value={
          statistics.totalAttachments
        }
        icon={
          <Paperclip
            size={22}
          />
        }
      />

      <StatCard
        title="Notifications"
        value={
          statistics.totalNotifications
        }
        icon={
          <Bell size={22} />
        }
      />
    </DashboardGrid>
  );
}