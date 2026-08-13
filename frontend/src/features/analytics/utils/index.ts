/**
 * Analytics utilities.
 */

import type {
  AnalyticsDateRangeQuery,
  AnalyticsFilterState,
} from "../types/analytics.types";

/**
 * Formats a date as an ISO `YYYY-MM-DD` string using local time.
 *
 * @param date - Date to format.
 * @returns ISO date string.
 */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Preset date range lengths, in days.
 */
const PRESET_DAYS: Readonly<Record<string, number>> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

/**
 * Resolves a filter state into a concrete date range query.
 *
 * @param filter - Analytics filter state.
 * @returns Resolved date range query, or an empty query for no filter.
 */
export function resolveDateRange(
  filter: AnalyticsFilterState,
): AnalyticsDateRangeQuery {
  if (filter.preset === "custom") {
    return {
      startDate: filter.startDate || undefined,
      endDate: filter.endDate || undefined,
    };
  }

  const days = PRESET_DAYS[filter.preset];

  if (days === undefined) {
    return {};
  }

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));

  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
  };
}
