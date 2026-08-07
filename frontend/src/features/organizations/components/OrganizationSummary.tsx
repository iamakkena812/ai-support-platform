/**
 * Organization summary component.
 *
 * Displays a summary of an organization.
 */

import {
  Building2,
  Calendar,
  FolderKanban,
  Globe,
  Users,
} from "lucide-react";

/**
 * Component properties.
 */
export interface OrganizationSummaryProps {
  /**
   * Organization name.
   */
  readonly name: string;

  /**
   * Organization description.
   */
  readonly description?: string;

  /**
   * Organization status.
   */
  readonly status: string;

  /**
   * Number of users.
   */
  readonly totalUsers: number;

  /**
   * Number of projects.
   */
  readonly totalProjects: number;

  /**
   * Creation date.
   */
  readonly createdAt: string | Date;
}

/**
 * Organization summary.
 *
 * @param props Component properties.
 * @returns Organization summary component.
 */
export function OrganizationSummary({
  name,
  description,
  status,
  totalUsers,
  totalProjects,
  createdAt,
}: OrganizationSummaryProps): React.JSX.Element {
  const created =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
          <Building2
            size={30}
            className="text-blue-600"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">
            {name}
          </h2>

          {description ? (
            <p className="mt-2 text-slate-600">
              {description}
            </p>
          ) : (
            <p className="mt-2 text-slate-400 italic">
              No description available.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-3">
          <Globe
            size={20}
            className="text-blue-600"
          />

          <div>
            <p className="text-sm text-slate-500">
              Status
            </p>

            <p className="font-semibold text-slate-900">
              {status}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users
            size={20}
            className="text-green-600"
          />

          <div>
            <p className="text-sm text-slate-500">
              Users
            </p>

            <p className="font-semibold text-slate-900">
              {totalUsers}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FolderKanban
            size={20}
            className="text-purple-600"
          />

          <div>
            <p className="text-sm text-slate-500">
              Projects
            </p>

            <p className="font-semibold text-slate-900">
              {totalProjects}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar
            size={20}
            className="text-orange-600"
          />

          <div>
            <p className="text-sm text-slate-500">
              Created
            </p>

            <p className="font-semibold text-slate-900">
              {created.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}