/**
 * Project details component.
 *
 * Displays detailed information
 * about a project.
 */

import {
  Building2,
  Calendar,
  FileText,
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
export interface ProjectDetailsProps {
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

  /**
   * Updated date.
   */
  readonly updatedAt?: string | Date;

  /**
   * Start date.
   */
  readonly startDate?: string | Date;

  /**
   * End date.
   */
  readonly endDate?: string | Date;
}

/**
 * Project details component.
 *
 * @param props Component properties.
 * @returns Project details component.
 */
export function ProjectDetails({
  name,
  description,
  organization,
  team,
  owner,
  status,
  progress,
  memberCount,
  createdAt,
  updatedAt,
  startDate,
  endDate,
}: ProjectDetailsProps): React.JSX.Element {
  const created =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt);

  const updated =
    updatedAt instanceof Date
      ? updatedAt
      : updatedAt
        ? new Date(updatedAt)
        : null;

  const started =
    startDate instanceof Date
      ? startDate
      : startDate
        ? new Date(startDate)
        : null;

  const ended =
    endDate instanceof Date
      ? endDate
      : endDate
        ? new Date(endDate)
        : null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-8 flex items-start gap-4">
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

      <div className="grid gap-6 md:grid-cols-2">
        <DetailItem
          icon={
            <Building2
              size={18}
              className="text-blue-600"
            />
          }
          label="Organization"
          value={organization}
        />

        <DetailItem
          icon={
            <Users
              size={18}
              className="text-green-600"
            />
          }
          label="Team"
          value={team}
        />

        <DetailItem
          icon={
            <Users
              size={18}
              className="text-indigo-600"
            />
          }
          label="Owner"
          value={owner}
        />

        <DetailItem
          icon={
            <FolderKanban
              size={18}
              className="text-purple-600"
            />
          }
          label="Members"
          value={memberCount.toString()}
        />

        <DetailItem
          icon={
            <Target
              size={18}
              className="text-orange-600"
            />
          }
          label="Progress"
          value={`${progress}%`}
        />

        <DetailItem
          icon={
            <FileText
              size={18}
              className="text-slate-600"
            />
          }
          label="Description"
          value={description}
        />

        <DetailItem
          icon={
            <Calendar
              size={18}
              className="text-blue-600"
            />
          }
          label="Start Date"
          value={
            started
              ? started.toLocaleDateString()
              : "-"
          }
        />

        <DetailItem
          icon={
            <Calendar
              size={18}
              className="text-red-600"
            />
          }
          label="End Date"
          value={
            ended
              ? ended.toLocaleDateString()
              : "-"
          }
        />

        <DetailItem
          icon={
            <Calendar
              size={18}
              className="text-green-600"
            />
          }
          label="Created"
          value={created.toLocaleString()}
        />

        <DetailItem
          icon={
            <Calendar
              size={18}
              className="text-slate-600"
            />
          }
          label="Updated"
          value={
            updated
              ? updated.toLocaleString()
              : "-"
          }
        />
      </div>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Project Progress
          </span>

          <span className="text-sm font-semibold text-slate-900">
            {progress}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
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
 * Detail item properties.
 */
interface DetailItemProps {
  readonly icon: React.JSX.Element;
  readonly label: string;
  readonly value?: string;
}

/**
 * Detail item.
 *
 * @param props Component properties.
 * @returns Detail item.
 */
function DetailItem({
  icon,
  label,
  value,
}: DetailItemProps): React.JSX.Element {
  return (
    <div className="flex items-start gap-3">
      {icon}

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-medium text-slate-900">
          {value ?? "-"}
        </p>
      </div>
    </div>
  );
}