/**
 * Team statistics component.
 *
 * Displays team-related statistics.
 */

import {
  CheckCircle2,
  FolderKanban,
  UserRound,
  Users,
  UserX,
} from "lucide-react";

import {
  DashboardGrid,
  StatCard,
} from "../../dashboard/components";

/**
 * Component properties.
 */
export interface TeamStatsProps {
  /**
   * Total teams.
   */
  readonly totalTeams: number;

  /**
   * Active teams.
   */
  readonly activeTeams: number;

  /**
   * Inactive teams.
   */
  readonly inactiveTeams: number;

  /**
   * Total members.
   */
  readonly totalMembers: number;

  /**
   * Assigned projects.
   */
  readonly assignedProjects: number;
}

/**
 * Team statistics component.
 *
 * @param props Component properties.
 * @returns Team statistics component.
 */
export function TeamStats({
  totalTeams,
  activeTeams,
  inactiveTeams,
  totalMembers,
  assignedProjects,
}: TeamStatsProps): React.JSX.Element {
  return (
    <DashboardGrid>
      <StatCard
        title="Total Teams"
        value={totalTeams}
        icon={
          <Users size={22} />
        }
      />

      <StatCard
        title="Active Teams"
        value={activeTeams}
        icon={
          <CheckCircle2
            size={22}
          />
        }
      />

      <StatCard
        title="Inactive Teams"
        value={inactiveTeams}
        icon={
          <UserX size={22} />
        }
      />

      <StatCard
        title="Members"
        value={totalMembers}
        icon={
          <UserRound
            size={22}
          />
        }
      />

      <StatCard
        title="Projects"
        value={assignedProjects}
        icon={
          <FolderKanban
            size={22}
          />
        }
      />
    </DashboardGrid>
  );
}