/**
 * Data filters component.
 *
 * Displays reusable filter controls.
 */

import type {
  ReactNode,
} from "react";

/**
 * Component properties.
 */
export interface DataFiltersProps {
  /**
   * Filter controls.
   */
  readonly children: ReactNode;

  /**
   * Reset action.
   */
  readonly onReset?: () => void;
}

/**
 * Data filters.
 *
 * @param props Component properties.
 * @returns Data filters component.
 */
export function DataFilters({
  children,
  onReset,
}: DataFiltersProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {children}

      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Reset Filters
        </button>
      ) : null}
    </div>
  );
}