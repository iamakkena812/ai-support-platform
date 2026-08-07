/**
 * Data table component.
 *
 * Displays reusable data tables with loading
 * and empty states.
 */

import type {
  ReactNode,
} from "react";

import {
  EmptyState,
  LoadingSpinner,
} from "../common";

import {
  Table,
} from "../ui";

import type {
  TableColumn,
} from "../ui";

/**
 * Component properties.
 */
export interface DataTableProps<T> {
  /**
   * Table columns.
   */
  readonly columns: readonly TableColumn<T>[];

  /**
   * Table data.
   */
  readonly data: readonly T[];

  /**
   * Row key selector.
   */
  readonly rowKey: (
    row: T,
  ) => string;

  /**
   * Loading indicator.
   */
  readonly loading?: boolean;

  /**
   * Empty title.
   */
  readonly emptyTitle?: string;

  /**
   * Empty description.
   */
  readonly emptyDescription?: string;

  /**
   * Optional actions.
   */
  readonly actions?: ReactNode;
}

/**
 * Data table.
 *
 * @param props Component properties.
 * @returns Data table.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There is no data to display.",
  actions,
}: DataTableProps<T>): React.JSX.Element {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <>
  <EmptyState
    title={emptyTitle}
    description={emptyDescription}
  />

    {actions ? (
        <div className="mt-6 flex justify-center">
        {actions}
        </div>
    ) : null}
    </>
    );
  }

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={rowKey}
    />
  );
}