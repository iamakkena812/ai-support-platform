/**
 * Project statistics component.
 *
 * Displays project-related statistics.
 */

import {
  CheckCircle2,
  Clock3,
  FolderKanban,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  DashboardGrid,
  StatCard,
} from "../../dashboard/components";

/**
 * Component properties.
 */
export interface ProjectStatsProps {
  /**
   * Total projects.
   */
  readonly totalProjects: number;

  /**
   * Active projects.
   */
  readonly activeProjects: number;

  /**
   * Completed projects.
   */
  readonly completedProjects: number;

  /**
   * Total members.
   */
  readonly totalMembers: number;

  /**
   * Overall progress.
   */
  readonly averageProgress: number;
}

/**
 * Project statistics component.
 *
 * @param props Component properties.
 * @returns Project statistics component.
 */
export function ProjectStats({
  totalProjects,
  activeProjects,
  completedProjects,
  totalMembers,
  averageProgress,
}: ProjectStatsProps): React.JSX.Element {
  return (
    <DashboardGrid>
      <StatCard
        title="Total Projects"
        value={totalProjects}
        icon={
          <FolderKanban
            size={22}
          />
        }
      />

      <StatCard
        title="Active Projects"
        value={activeProjects}
        icon={
          <Clock3
            size={22}
          />
        }
      />

      <StatCard
        title="Completed Projects"
        value={completedProjects}
        icon={
          <CheckCircle2
            size={22}
          />
        }
      />

      <StatCard
        title="Members"
        value={totalMembers}
        icon={
          <Users
            size={22}
          />
        }
      />

      <StatCard
        title="Progress"
        value={`${averageProgress}%`}
        icon={
          <TrendingUp
            size={22}
          />
        }
      />
    </DashboardGrid>
  );
}