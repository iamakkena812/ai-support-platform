/**
 * Bulk actions component.
 *
 * Displays actions for selected table rows.
 */

import type {
  ReactNode,
} from "react";

/**
 * Bulk action.
 */
export interface BulkAction {
  /**
   * Action identifier.
   */
  readonly id: string;

  /**
   * Action label.
   */
  readonly label: string;

  /**
   * Action icon.
   */
  readonly icon?: ReactNode;

  /**
   * Click handler.
   */
  readonly onClick: () => void;

  /**
   * Disabled state.
   */
  readonly disabled?: boolean;
}

/**
 * Component properties.
 */
export interface BulkActionsProps {
  /**
   * Number of selected records.
   */
  readonly selectedCount: number;

  /**
   * Available actions.
   */
  readonly actions: readonly BulkAction[];

  /**
   * Clear selection callback.
   */
  readonly onClearSelection?: () => void;
}

/**
 * Bulk actions component.
 *
 * @param props Component properties.
 * @returns Bulk actions component.
 */
export function BulkActions({
  selectedCount,
  actions,
  onClearSelection,
}: BulkActionsProps): React.JSX.Element {
  if (selectedCount === 0) {
    return <></>;
  }

  return (
    <section className="mb-4 flex flex-col gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm font-medium text-blue-800">
        {selectedCount} record
        {selectedCount !== 1 ? "s" : ""} selected
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={action.disabled}
            onClick={action.onClick}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {action.icon}

            {action.label}
          </button>
        ))}

        {onClearSelection ? (
          <button
            type="button"
            onClick={onClearSelection}
            className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            Clear Selection
          </button>
        ) : null}
      </div>
    </section>
  );
}