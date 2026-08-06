/**
 * Dashboard header component.
 */

import type {
  DashboardQueryValues,
} from "../schemas/dashboard.schema";

/**
 * Component properties.
 */
export interface DashboardHeaderProps {
  /**
   * Current dashboard query.
   */
  readonly query: DashboardQueryValues;

  /**
   * Indicates whether dashboard data is refreshing.
   */
  readonly isRefreshing?: boolean;

  /**
   * Invoked when the dashboard is refreshed.
   */
  readonly onRefresh: () => void;

  /**
   * Invoked when the date range changes.
   */
  readonly onDateRangeChange: (
    value: DashboardQueryValues["dateRange"],
  ) => void;

  /**
   * Invoked when the refresh interval changes.
   */
  readonly onRefreshIntervalChange: (
    value: DashboardQueryValues["refreshInterval"],
  ) => void;
}

/**
 * Dashboard header.
 *
 * @param props - Component properties.
 * @returns Dashboard header component.
 */
export function DashboardHeader({
  query,
  isRefreshing = false,
  onRefresh,
  onDateRangeChange,
  onRefreshIntervalChange,
}: DashboardHeaderProps): React.JSX.Element {
  return (
    <header className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Monitor support operations,
          customer activity, projects,
          tickets, notifications, and
          AI insights from one place.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Date Range
          </label>

          <select
            value={
              query.dateRange
            }
            onChange={(
              event,
            ) =>
              onDateRangeChange(
                event.target
                  .value as DashboardQueryValues["dateRange"],
              )
            }
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="today">
              Today
            </option>

            <option value="7d">
              Last 7 Days
            </option>

            <option value="30d">
              Last 30 Days
            </option>

            <option value="90d">
              Last 90 Days
            </option>

            <option value="1y">
              Last Year
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Auto Refresh
          </label>

          <select
            value={
              query.refreshInterval
            }
            onChange={(
              event,
            ) =>
              onRefreshIntervalChange(
                event.target
                  .value as DashboardQueryValues["refreshInterval"],
              )
            }
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="off">
              Off
            </option>

            <option value="30s">
              Every 30 Seconds
            </option>

            <option value="1m">
              Every Minute
            </option>

            <option value="5m">
              Every 5 Minutes
            </option>

            <option value="15m">
              Every 15 Minutes
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={
            isRefreshing
          }
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRefreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>
    </header>
  );
}