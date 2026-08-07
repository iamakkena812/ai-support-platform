/**
 * User statistics component.
 *
 * Displays user-related statistics.
 */

import {
  CheckCircle2,
  Shield,
  UserRound,
  UserX,
  Users,
} from "lucide-react";

import {
  DashboardGrid,
  StatCard,
} from "../../dashboard/components";

/**
 * Component properties.
 */
export interface UserStatsProps {
  /**
   * Total users.
   */
  readonly totalUsers: number;

  /**
   * Active users.
   */
  readonly activeUsers: number;

  /**
   * Inactive users.
   */
  readonly inactiveUsers: number;

  /**
   * Administrators.
   */
  readonly administrators: number;

  /**
   * Organization members.
   */
  readonly organizationMembers: number;
}

/**
 * User statistics.
 *
 * @param props Component properties.
 * @returns User statistics component.
 */
export function UserStats({
  totalUsers,
  activeUsers,
  inactiveUsers,
  administrators,
  organizationMembers,
}: UserStatsProps): React.JSX.Element {
  return (
    <DashboardGrid>
      <StatCard
        title="Total Users"
        value={totalUsers}
        icon={
          <Users size={22} />
        }
      />

      <StatCard
        title="Active Users"
        value={activeUsers}
        icon={
          <CheckCircle2 size={22} />
        }
      />

      <StatCard
        title="Inactive Users"
        value={inactiveUsers}
        icon={
          <UserX size={22} />
        }
      />

      <StatCard
        title="Administrators"
        value={administrators}
        icon={
          <Shield size={22} />
        }
      />

      <StatCard
        title="Organization Members"
        value={organizationMembers}
        icon={
          <UserRound size={22} />
        }
      />
    </DashboardGrid>
  );
}