/**
 * Data toolbar component.
 *
 * Displays reusable controls for searching,
 * filtering, and performing actions.
 */

import type {
  ReactNode,
} from "react";

/**
 * Component properties.
 */
export interface DataToolbarProps {
  /**
   * Search component.
   */
  readonly search?: ReactNode;

  /**
   * Filter controls.
   */
  readonly filters?: ReactNode;

  /**
   * Left-side actions.
   */
  readonly actions?: ReactNode;

  /**
   * Right-side actions.
   */
  readonly secondaryActions?: ReactNode;
}

/**
 * Data toolbar.
 *
 * @param props Component properties.
 * @returns Data toolbar.
 */
export function DataToolbar({
  search,
  filters,
  actions,
  secondaryActions,
}: DataToolbarProps): React.JSX.Element {
  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
          {search}

          {filters}
        </div>

        {(actions ?? secondaryActions) ? (
          <div className="flex flex-wrap items-center gap-2">
            {secondaryActions}

            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}