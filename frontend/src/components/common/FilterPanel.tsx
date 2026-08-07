/**
 * Filter panel component.
 *
 * Displays reusable page filters.
 */

import type {
  ReactNode,
} from "react";

/**
 * Component properties.
 */
export interface FilterPanelProps {
  /**
   * Search component.
   */
  readonly search?: ReactNode;

  /**
   * Filter controls.
   */
  readonly filters?: ReactNode;

  /**
   * Action buttons.
   */
  readonly actions?: ReactNode;
}

/**
 * Filter panel.
 *
 * @param props Component properties.
 * @returns Filter panel component.
 */
export function FilterPanel({
  search,
  filters,
  actions,
}: FilterPanelProps): React.JSX.Element {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
          {search}

          {filters}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}