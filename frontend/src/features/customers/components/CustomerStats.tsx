/**
 * Customer statistics component.
 *
 * Displays customer-related statistics.
 */

import {
  CheckCircle2,
  PauseCircle,
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
   * Suspended customers.
   */
  readonly suspendedCustomers: number;
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
  suspendedCustomers,
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
        title="Suspended Customers"
        value={suspendedCustomers}
        icon={
          <PauseCircle
            size={22}
          />
        }
      />
    </DashboardGrid>
  );
}
