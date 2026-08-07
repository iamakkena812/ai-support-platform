/**
 * Data pagination component.
 *
 * Displays pagination controls together with
 * record information.
 */

import { Pagination } from "../ui";

/**
 * Component properties.
 */
export interface DataPaginationProps {
  /**
   * Current page.
   */
  readonly page: number;

  /**
   * Page size.
   */
  readonly pageSize: number;

  /**
   * Total records.
   */
  readonly totalRecords: number;

  /**
   * Total pages.
   */
  readonly totalPages: number;

  /**
   * Page change callback.
   *
   * @param page Selected page.
   */
  readonly onPageChange: (
    page: number,
  ) => void;
}

/**
 * Data pagination.
 *
 * @param props Component properties.
 * @returns Data pagination component.
 */
export function DataPagination({
  page,
  pageSize,
  totalRecords,
  totalPages,
  onPageChange,
}: DataPaginationProps): React.JSX.Element {
  if (totalRecords === 0) {
    return <></>;
  }

  const startRecord =
    (page - 1) * pageSize + 1;

  const endRecord = Math.min(
    page * pageSize,
    totalRecords,
  );

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white px-6 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-slate-600">
        Showing{" "}
        <span className="font-semibold">
          {startRecord}
        </span>{" "}
        to{" "}
        <span className="font-semibold">
          {endRecord}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {totalRecords}
        </span>{" "}
        records
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={
          onPageChange
        }
      />
    </div>
  );
}