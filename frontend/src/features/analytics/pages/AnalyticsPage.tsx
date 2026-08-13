/**
 * Analytics / Reports page.
 */

import { useMemo, useState } from "react";

import { useAuth } from "../../../app/providers/auth/useAuth";

import { AnalyticsFilters } from "../components/AnalyticsFilters";
import { AnalyticsStatCard } from "../components/AnalyticsStatCard";
import { DistributionChart } from "../components/DistributionChart";

import {
  useAnalyticsDashboard,
  useOrganizationMetrics,
} from "../hooks/useAnalytics";

import type { AnalyticsFilterState } from "../types/analytics.types";

import { resolveDateRange } from "../utils";

/**
 * Analytics / Reports page.
 *
 * @returns Analytics page component.
 */
export function AnalyticsPage(): React.JSX.Element {
  const { user } = useAuth();

  const [filter, setFilter] = useState<AnalyticsFilterState>({
    preset: "30d",
  });

  const query = useMemo(() => resolveDateRange(filter), [filter]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAnalyticsDashboard(query);

  const isSuperuser = user?.isSuperuser ?? false;

  const organizationMetricsQuery = useOrganizationMetrics(isSuperuser);

  const handleRefresh = (): void => {
    void refetch();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>

          <p className="mt-1 text-gray-600">
            Analytics and reporting for your organization&apos;s tickets,
            users, projects, workflows, and SLA compliance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isFetching}
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <AnalyticsFilters value={filter} onChange={setFilter} />

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading analytics...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error instanceof Error
            ? error.message
            : "Failed to load analytics."}
        </div>
      ) : null}

      {!isLoading && !isError && data ? (
        data.tickets.total === 0 &&
        data.projects === 0 &&
        data.workflows.total === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
            No analytics data yet for the selected range.
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <AnalyticsStatCard
                title="Total Tickets"
                value={data.tickets.total}
              />

              <AnalyticsStatCard title="Projects" value={data.projects} />

              <AnalyticsStatCard
                title="Users"
                value={data.users}
                description={`${data.activeUsers} active`}
              />

              <AnalyticsStatCard
                title="Workflows"
                value={data.workflows.total}
                description={`${data.workflows.active} active`}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <AnalyticsStatCard
                title="SLA Policies"
                value={data.sla.policies}
              />

              <AnalyticsStatCard
                title="SLA Breaches"
                value={data.sla.breaches}
              />

              <AnalyticsStatCard
                title="SLA Compliance"
                value={`${data.sla.compliancePercentage}%`}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <DistributionChart
                title="Tickets by Status"
                data={data.tickets.byStatus}
              />

              <DistributionChart
                title="Tickets by Priority"
                data={data.tickets.byPriority}
              />
            </div>
          </>
        )
      ) : null}

      {isSuperuser && organizationMetricsQuery.data ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <AnalyticsStatCard
            title="Platform Organizations"
            value={organizationMetricsQuery.data.total}
            description={`${organizationMetricsQuery.data.active} active`}
          />
        </div>
      ) : null}
    </div>
  );
}
