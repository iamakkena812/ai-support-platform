/**
 * Column selector component.
 *
 * Displays a reusable column visibility selector.
 */

import { Columns3 } from "lucide-react";

/**
 * Column option.
 */
export interface ColumnOption {
  /**
   * Column identifier.
   */
  readonly id: string;

  /**
   * Column label.
   */
  readonly label: string;

  /**
   * Whether the column is visible.
   */
  readonly visible: boolean;
}

/**
 * Component properties.
 */
export interface ColumnSelectorProps {
  /**
   * Available columns.
   */
  readonly columns: readonly ColumnOption[];

  /**
   * Visibility change callback.
   *
   * @param columnId Column identifier.
   * @param visible Visibility state.
   */
  readonly onToggle: (
    columnId: string,
    visible: boolean,
  ) => void;
}

/**
 * Column selector.
 *
 * @param props Component properties.
 * @returns Column selector component.
 */
export function ColumnSelector({
  columns,
  onToggle,
}: ColumnSelectorProps): React.JSX.Element {
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
        <Columns3 size={16} />

        Columns
      </summary>

      <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
        <div className="mb-3 text-sm font-semibold text-slate-900">
          Visible Columns
        </div>

        <div className="space-y-3">
          {columns.map((column) => (
            <label
              key={column.id}
              className="flex items-center gap-3"
            >
              <input
                type="checkbox"
                checked={column.visible}
                onChange={(event) =>
                  onToggle(
                    column.id,
                    event.target.checked,
                  )
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <span className="text-sm text-slate-700">
                {column.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </details>
  );
}