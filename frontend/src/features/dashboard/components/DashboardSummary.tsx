/**
 * Dashboard summary component.
 *
 * Displays a high-level overview of
 * dashboard statistics and system status.
 */

import {
  Activity,
  Building2,
  CheckCircle2,
  Ticket,
  Users,
} from "lucide-react";

import type {
  DashboardStatistics,
  SystemHealth,
} from "../types/dashboard.types";

/**
 * Component properties.
 */
export interface DashboardSummaryProps {
  /**
   * Dashboard statistics.
   */
  readonly statistics: DashboardStatistics;

  /**
   * System health.
   */
  readonly systemHealth: SystemHealth;
}

/**
 * Dashboard summary.
 *
 * @param props Component properties.
 * @returns Dashboard summary.
 */
export function DashboardSummary({
  statistics,
  systemHealth,
}: DashboardSummaryProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity
              size={22}
              className="text-blue-600"
            />

            <h2 className="text-xl font-semibold text-slate-900">
              Dashboard Summary
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            Overview of the current platform activity and
            system status.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
          <CheckCircle2
            size={18}
            className="text-green-600"
          />

          <span className="text-sm font-medium text-green-700">
            {systemHealth.status}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-100 p-3">
            <Building2
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Organizations
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {statistics.totalOrganizations}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-indigo-100 p-3">
            <Users
              size={22}
              className="text-indigo-600"
            />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Users
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {statistics.totalUsers}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-orange-100 p-3">
            <Ticket
              size={22}
              className="text-orange-600"
            />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Tickets
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {statistics.totalTickets}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-4 text-sm text-slate-500">
        Last updated:{" "}
        {new Date(
          systemHealth.updatedAt,
        ).toLocaleString()}
      </div>
    </section>
  );
}