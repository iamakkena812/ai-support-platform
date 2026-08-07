/**
 * Dashboard page.
 */

import {
  useEffect,
  useState,
} from "react";

import { AIInsightsCard } from "../components/AIInsightsCard";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardStats } from "../components/DashboardStats";
import { NotificationSummary } from "../components/NotificationSummary";
import { RecentCustomers } from "../components/RecentCustomers";
import { RecentProjects } from "../components/RecentProjects";
import { RecentTickets } from "../components/RecentTickets";
import { SystemHealthCard } from "../components/SystemHealthCard";

import {
  useDashboard,
  useRefreshDashboard,
} from "../hooks/useDashboard";

import type {
  DashboardQueryValues,
} from "../schemas/dashboard.schema";

/**
 * Dashboard page.
 *
 * @returns Dashboard page component.
 */
export function DashboardPage(): React.JSX.Element {
  const [
    query,
    setQuery,
  ] = useState<DashboardQueryValues>({
    dateRange: "30d",
    refreshInterval: "off",
  });

  const {
    data,
    isLoading,
    isError,
    error,
  } = useDashboard(query);

  const refreshMutation =
    useRefreshDashboard();

  useEffect(() => {
    console.group("Dashboard");

    console.log(
      "Loading:",
      isLoading,
    );

    console.log(
      "Error:",
      isError,
    );

    console.log(
      "Response:",
      data,
    );

    console.groupEnd();
  }, [
    data,
    isLoading,
    isError,
  ]);

  /**
   * Refresh dashboard.
   */
  const handleRefresh =
    async (): Promise<void> => {
      try {
        await refreshMutation.mutateAsync();
      } catch (error) {
        console.error(
          "Failed to refresh dashboard.",
          error,
        );
      }
    };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-xl font-bold text-red-700">
            Dashboard Error
          </h2>

          <p className="text-red-600">
            {error instanceof Error
              ? error.message
              : "Unknown error."}
          </p>
        </div>
      </div>
    );
  }

  if (data == null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Dashboard data unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        query={query}
        isRefreshing={
          refreshMutation.isPending
        }
        onRefresh={() => {
          void handleRefresh();
        }}
        onDateRangeChange={(
          dateRange,
        ) =>
          setQuery((previous) => ({
            ...previous,
            dateRange,
          }))
        }
        onRefreshIntervalChange={(
          refreshInterval,
        ) =>
          setQuery((previous) => ({
            ...previous,
            refreshInterval,
          }))
        }
      />

      <DashboardStats
        statistics={
          data.statistics
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentTickets
          tickets={
            data.recentTickets
          }
        />

        <RecentCustomers
          customers={
            data.recentCustomers
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentProjects
          projects={
            data.recentProjects
          }
        />

        <NotificationSummary
          notifications={
            data.recentNotifications
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SystemHealthCard
          health={
            data.systemHealth
          }
        />

        <AIInsightsCard
          insights={
            data.aiInsights
          }
        />
      </div>
    </div>
  );
}