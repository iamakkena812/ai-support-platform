/**
 * Team details component.
 *
 * Displays detailed information
 * about a team.
 */

import {
  Building2,
  Calendar,
  FileText,
  FolderKanban,
  Users,
} from "lucide-react";

import {
  TeamStatusBadge,
} from "./TeamStatusBadge";

/**
 * Component properties.
 */
export interface TeamDetailsProps {
  /**
   * Team name.
   */
  readonly name: string;

  /**
   * Description.
   */
  readonly description?: string;

  /**
   * Organization.
   */
  readonly organization: string;

  /**
   * Status.
   */
  readonly status: string;

  /**
   * Member count.
   */
  readonly memberCount: number;

  /**
   * Project count.
   */
  readonly projectCount: number;

  /**
   * Created date.
   */
  readonly createdAt: string | Date;

  /**
   * Updated date.
   */
  readonly updatedAt?: string | Date;
}

/**
 * Team details component.
 *
 * @param props Component properties.
 * @returns Team details component.
 */
export function TeamDetails({
  name,
  description,
  organization,
  status,
  memberCount,
  projectCount,
  createdAt,
  updatedAt,
}: TeamDetailsProps): React.JSX.Element {
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

            <TeamStatusBadge
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
          label="Members"
          value={memberCount.toString()}
        />

        <DetailItem
          icon={
            <FolderKanban
              size={18}
              className="text-purple-600"
            />
          }
          label="Projects"
          value={projectCount.toString()}
        />

        <DetailItem
          icon={
            <FileText
              size={18}
              className="text-orange-600"
            />
          }
          label="Description"
          value={description}
        />

        <DetailItem
          icon={
            <Calendar
              size={18}
              className="text-indigo-600"
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
              : undefined
          }
        />
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