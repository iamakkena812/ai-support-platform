/**
 * Sort button component.
 *
 * Displays a reusable sortable column header.
 */

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";

/**
 * Sort direction.
 */
export type SortDirection =
  | "asc"
  | "desc"
  | null;

/**
 * Component properties.
 */
export interface SortButtonProps {
  /**
   * Column label.
   */
  readonly label: string;

  /**
   * Current sort direction.
   */
  readonly direction: SortDirection;

  /**
   * Sort callback.
   */
  readonly onSort: () => void;
}

/**
 * Sort button.
 *
 * @param props Component properties.
 * @returns Sort button component.
 */
export function SortButton({
  label,
  direction,
  onSort,
}: SortButtonProps): React.JSX.Element {
  /**
   * Returns the current sort icon.
   */
  const getIcon = (): React.JSX.Element => {
    switch (direction) {
      case "asc":
        return <ArrowUp size={16} />;

      case "desc":
        return <ArrowDown size={16} />;

      default:
        return (
          <ArrowUpDown
            size={16}
          />
        );
    }
  };

  return (
    <button
      type="button"
      onClick={onSort}
      className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <span>{label}</span>

      {getIcon()}
    </button>
  );
}