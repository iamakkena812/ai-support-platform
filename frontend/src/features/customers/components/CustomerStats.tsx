/**
 * Customer statistics component.
 *
 * Displays customer-related statistics.
 */

import {
  Building2,
  CheckCircle2,
  FolderKanban,
  Ticket,
  Users,
} from "lucide-react";

import {
  DashboardGrid,
  StatCard,
} from "../../dashboard/components";

/**
 * Component properties.
 */
export interface CustomerStatsProps {
  /**
   * Total customers.
   */
  readonly totalCustomers: number;

  /**
   * Active customers.
   */
  readonly activeCustomers: number;

  /**
   * Total organizations.
   */
  readonly totalOrganizations: number;

  /**
   * Related projects.
   */
  readonly totalProjects: number;

  /**
   * Open tickets.
   */
  readonly openTickets: number;
}

/**
 * Customer statistics component.
 *
 * @param props Component properties.
 * @returns Customer statistics.
 */
export function CustomerStats({
  totalCustomers,
  activeCustomers,
  totalOrganizations,
  totalProjects,
  openTickets,
}: CustomerStatsProps): React.JSX.Element {
  return (
    <DashboardGrid>
      <StatCard
        title="Total Customers"
        value={totalCustomers}
        icon={
          <Users
            size={22}
          />
        }
      />

      <StatCard
        title="Active Customers"
        value={activeCustomers}
        icon={
          <CheckCircle2
            size={22}
          />
        }
      />

      <StatCard
        title="Organizations"
        value={totalOrganizations}
        icon={
          <Building2
            size={22}
          />
        }
      />

      <StatCard
        title="Projects"
        value={totalProjects}
        icon={
          <FolderKanban
            size={22}
          />
        }
      />

      <StatCard
        title="Open Tickets"
        value={openTickets}
        icon={
          <Ticket
            size={22}
          />
        }
      />
    </DashboardGrid>
  );
}