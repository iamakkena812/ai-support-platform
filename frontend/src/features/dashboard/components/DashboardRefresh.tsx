/**
 * Dashboard refresh component.
 *
 * Displays the dashboard refresh status
 * and refresh action.
 */

import {
  RefreshCw,
} from "lucide-react";

/**
 * Component properties.
 */
export interface DashboardRefreshProps {
  /**
   * Last refresh time.
   */
  readonly lastUpdated: Date | string;

  /**
   * Refresh callback.
   */
  readonly onRefresh: () => void;

  /**
   * Indicates whether refresh is in progress.
   */
  readonly isRefreshing?: boolean;
}

/**
 * Dashboard refresh.
 *
 * @param props Component properties.
 * @returns Dashboard refresh component.
 */
export function DashboardRefresh({
  lastUpdated,
  onRefresh,
  isRefreshing = false,
}: DashboardRefreshProps): React.JSX.Element {
  const updated =
    lastUpdated instanceof Date
      ? lastUpdated
      : new Date(lastUpdated);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-900">
          Dashboard Status
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Last updated{" "}
          {updated.toLocaleString()}
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw
          size={18}
          className={
            isRefreshing
              ? "animate-spin"
              : ""
          }
        />

        {isRefreshing
          ? "Refreshing..."
          : "Refresh"}
      </button>
    </div>
  );
}