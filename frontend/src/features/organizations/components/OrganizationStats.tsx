/**
 * Organization statistics component.
 *
 * Displays organization statistics.
 */

import {
  Building2,
  CheckCircle2,
  FolderKanban,
  Users,
  XCircle,
} from "lucide-react";

import {
  DashboardGrid,
} from "../../dashboard/components";

import {
  StatCard,
} from "../../dashboard/components";

/**
 * Component properties.
 */
export interface OrganizationStatsProps {
  /**
   * Total organizations.
   */
  readonly totalOrganizations: number;

  /**
   * Active organizations.
   */
  readonly activeOrganizations: number;

  /**
   * Inactive organizations.
   */
  readonly inactiveOrganizations: number;

  /**
   * Total projects.
   */
  readonly totalProjects: number;

  /**
   * Total users.
   */
  readonly totalUsers: number;
}

/**
 * Organization statistics.
 *
 * @param props Component properties.
 * @returns Organization statistics component.
 */
export function OrganizationStats({
  totalOrganizations,
  activeOrganizations,
  inactiveOrganizations,
  totalProjects,
  totalUsers,
}: OrganizationStatsProps): React.JSX.Element {
  return (
    <DashboardGrid>
      <StatCard
        title="Organizations"
        value={totalOrganizations}
        icon={
          <Building2 size={22} />
        }
      />

      <StatCard
        title="Active"
        value={activeOrganizations}
        icon={
          <CheckCircle2
            size={22}
          />
        }
      />

      <StatCard
        title="Inactive"
        value={
          inactiveOrganizations
        }
        icon={
          <XCircle size={22} />
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
        title="Users"
        value={totalUsers}
        icon={
          <Users size={22} />
        }
      />
    </DashboardGrid>
  );
}