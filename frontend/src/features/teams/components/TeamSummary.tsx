/**
 * Team summary component.
 *
 * Displays a summary of a team.
 */

import {
  Building2,
  Calendar,
  FolderKanban,
  Users,
} from "lucide-react";

import {
  TeamStatusBadge,
} from "./TeamStatusBadge";

/**
 * Component properties.
 */
export interface TeamSummaryProps {
  /**
   * Team name.
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
   * Team status.
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
   * Creation date.
   */
  readonly createdAt: string | Date;
}

/**
 * Team summary component.
 *
 * @param props Component properties.
 * @returns Team summary.
 */
export function TeamSummary({
  name,
  description,
  organization,
  status,
  memberCount,
  projectCount,
  createdAt,
}: TeamSummaryProps): React.JSX.Element {
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

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
          label="Members"
          value={memberCount.toString()}
        />

        <SummaryItem
          icon={
            <FolderKanban
              size={18}
              className="text-purple-600"
            />
          }
          label="Projects"
          value={projectCount.toString()}
        />

        <SummaryItem
          icon={
            <Calendar
              size={18}
              className="text-orange-600"
            />
          }
          label="Created"
          value={created.toLocaleDateString()}
        />
      </div>
    </section>
  );
}

/**
 * Summary item properties.
 */
interface SummaryItemProps {
  readonly icon: React.JSX.Element;
  readonly label: string;
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