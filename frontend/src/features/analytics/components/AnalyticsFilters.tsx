/**
 * Analytics filters component.
 *
 * Lets the caller choose a preset date range (7d/30d/90d) or a
 * custom date range, matching the ranges the backend supports.
 */

import type {
  AnalyticsDateRangePreset,
  AnalyticsFilterState,
} from "../types/analytics.types";

/**
 * Component properties.
 */
export interface AnalyticsFiltersProps {
  /**
   * Current filter state.
   */
  readonly value: AnalyticsFilterState;

  /**
   * Invoked when the filter state changes.
   */
  readonly onChange: (value: AnalyticsFilterState) => void;
}

/**
 * Analytics filters.
 *
 * @param props - Component properties.
 * @returns Analytics filters component.
 */
export function AnalyticsFilters({
  value,
  onChange,
}: AnalyticsFiltersProps): React.JSX.Element {
  const handlePresetChange = (
    preset: AnalyticsDateRangePreset,
  ): void => {
    onChange({
      preset,
      startDate: value.startDate,
      endDate: value.endDate,
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Date Range
        </label>

        <select
          value={value.preset}
          onChange={(event) =>
            handlePresetChange(
              event.target.value as AnalyticsDateRangePreset,
            )
          }
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {value.preset === "custom" ? (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Start Date
            </label>

            <input
              type="date"
              value={value.startDate ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  startDate: event.target.value,
                })
              }
              className="rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              End Date
            </label>

            <input
              type="date"
              value={value.endDate ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  endDate: event.target.value,
                })
              }
              className="rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
