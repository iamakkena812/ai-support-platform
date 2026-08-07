/**
 * Project summary component.
 *
 * Displays a summary of a project.
 */

import {
  Building2,
  Calendar,
  FolderKanban,
  Target,
  Users,
} from "lucide-react";

import {
  ProjectStatusBadge,
} from "./ProjectStatusBadge";

/**
 * Component properties.
 */
export interface ProjectSummaryProps {
  /**
   * Project name.
   */
  readonly name: string;

  /**
   * Description.
   */
  readonly description?: string;

  /**
   * Organization name.
   */
  readonly organization: string;

  /**
   * Team name.
   */
  readonly team: string;

  /**
   * Project owner.
   */
  readonly owner: string;

  /**
   * Status.
   */
  readonly status: string;

  /**
   * Progress percentage.
   */
  readonly progress: number;

  /**
   * Member count.
   */
  readonly memberCount: number;

  /**
   * Created date.
   */
  readonly createdAt: string | Date;
}

/**
 * Project summary component.
 *
 * @param props Component properties.
 * @returns Project summary.
 */
export function ProjectSummary({
  name,
  description,
  organization,
  team,
  owner,
  status,
  progress,
  memberCount,
  createdAt,
}: ProjectSummaryProps): React.JSX.Element {
  const created =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              {name}
            </h2>

            <ProjectStatusBadge
              status={status}
            />
          </div>

          <p className="mt-2 text-slate-600">
            {description ??
              "No description available."}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SummaryItem
          icon={
            <Building2
              size={18}
              className="text-blue-600"
            />
          }
          label="Organization"
          value={organization}
        />

        <SummaryItem
          icon={
            <Users
              size={18}
              className="text-green-600"
            />
          }
          label="Team"
          value={team}
        />

        <SummaryItem
          icon={
            <Users
              size={18}
              className="text-indigo-600"
            />
          }
          label="Owner"
          value={owner}
        />

        <SummaryItem
          icon={
            <Target
              size={18}
              className="text-orange-600"
            />
          }
          label="Progress"
          value={`${progress}%`}
        />

        <SummaryItem
          icon={
            <FolderKanban
              size={18}
              className="text-purple-600"
            />
          }
          label="Members"
          value={memberCount.toString()}
        />

        <SummaryItem
          icon={
            <Calendar
              size={18}
              className="text-slate-600"
            />
          }
          label="Created"
          value={created.toLocaleDateString()}
        />
      </div>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Overall Progress
          </span>

          <span className="text-sm font-semibold text-slate-900">
            {progress}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Summary item properties.
 */
interface SummaryItemProps {
  /**
   * Icon.
   */
  readonly icon: React.JSX.Element;

  /**
   * Label.
   */
  readonly label: string;

  /**
   * Value.
   */
  readonly value: string;
}

/**
 * Summary item.
 *
 * @param props Component properties.
 * @returns Summary item.
 */
function SummaryItem({
  icon,
  label,
  value,
}: SummaryItemProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3">
      {icon}

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-medium text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}