/**
 * Dashboard filters component.
 *
 * Displays filter controls for the dashboard.
 */

import {
  Filter,
  RotateCcw,
} from "lucide-react";

import type {
  DashboardQueryValues,
} from "../schemas/dashboard.schema";

export interface DashboardFiltersProps {
  /**
   * Current query.
   */
  readonly query: DashboardQueryValues;

  /**
   * Date range change callback.
   *
   * @param value Selected range.
   */
  readonly onDateRangeChange: (
    value: DashboardQueryValues["dateRange"],
  ) => void;

  /**
   * Refresh interval callback.
   *
   * @param value Selected interval.
   */
  readonly onRefreshIntervalChange: (
    value: DashboardQueryValues["refreshInterval"],
  ) => void;

  /**
   * Reset callback.
   */
  readonly onReset?: () => void;
}

/**
 * Dashboard filters.
 *
 * @param props Component properties.
 * @returns Dashboard filters.
 */
export function DashboardFilters({
  query,
  onDateRangeChange,
  onRefreshIntervalChange,
  onReset,
}: DashboardFiltersProps): React.JSX.Element {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Filter
          size={18}
          className="text-slate-600"
        />

        <h2 className="font-semibold text-slate-900">
          Filters
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Date Range
          </label>

          <select
            value={query.dateRange}
            onChange={(event) =>
              onDateRangeChange(
                event.target
                  .value as DashboardQueryValues["dateRange"],
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-600"
          >
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
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Auto Refresh
          </label>

          <select
            value={
              query.refreshInterval
            }
            onChange={(event) =>
              onRefreshIntervalChange(
                event.target
                  .value as DashboardQueryValues["refreshInterval"],
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-600"
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

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            disabled={!onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={16} />

            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}