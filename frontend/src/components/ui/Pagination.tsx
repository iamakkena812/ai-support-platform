/**
 * Pagination component.
 *
 * Displays reusable pagination controls.
 */

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Component properties.
 */
export interface PaginationProps {
  /**
   * Current page.
   */
  readonly page: number;

  /**
   * Total pages.
   */
  readonly totalPages: number;

  /**
   * Page change callback.
   *
   * @param page Page number.
   */
  readonly onPageChange: (
    page: number,
  ) => void;
}

/**
 * Pagination component.
 *
 * @param props Component properties.
 * @returns Pagination component.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps): React.JSX.Element {
  if (totalPages <= 1) {
    return <></>;
  }

  const previousDisabled =
    page <= 1;

  const nextDisabled =
    page >= totalPages;

  return (
    <nav
      className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4"
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={previousDisabled}
        onClick={() =>
          onPageChange(page - 1)
        }
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <div className="text-sm text-slate-600">
        Page{" "}
        <span className="font-semibold">
          {page}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {totalPages}
        </span>
      </div>

      <button
        type="button"
        disabled={nextDisabled}
        onClick={() =>
          onPageChange(page + 1)
        }
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}