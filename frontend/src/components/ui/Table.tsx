/**
 * Table component.
 *
 * Displays reusable tabular data.
 */

import type {
  ReactNode,
} from "react";

/**
 * Table column.
 */
export interface TableColumn<T> {
  /**
   * Unique column key.
   */
  readonly key: keyof T | string;

  /**
   * Column title.
   */
  readonly title: string;

  /**
   * Custom renderer.
   */
  readonly render?: (
    value: unknown,
    row: T,
  ) => ReactNode;

  /**
   * Optional width.
   */
  readonly width?: string;
}

/**
 * Component properties.
 */
export interface TableProps<T> {
  /**
   * Table columns.
   */
  readonly columns: readonly TableColumn<T>[];

  /**
   * Table rows.
   */
  readonly data: readonly T[];

  /**
   * Empty message.
   */
  readonly emptyMessage?: string;

  /**
   * Row identifier.
   */
  readonly rowKey: (
    row: T,
  ) => string;
}

/**
 * Table component.
 *
 * @param props Component properties.
 * @returns Table component.
 */
export function Table<T>({
  columns,
  data,
  rowKey,
  emptyMessage = "No records found.",
}: TableProps<T>): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map(
                (column) => (
                  <th
                    key={String(
                      column.key,
                    )}
                    style={{
                      width:
                        column.width,
                    }}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
                  >
                    {column.title}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length ===
            0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length
                  }
                  className="px-6 py-12 text-center text-slate-500"
                >
                  {
                    emptyMessage
                  }
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="transition hover:bg-slate-50"
                >
                  {columns.map(
                    (
                      column,
                    ) => {
                      const value =
                        (
                          row as Record<
                            string,
                            unknown
                          >
                        )[
                          String(
                            column.key,
                          )
                        ];

                      return (
                        <td
                          key={String(
                            column.key,
                          )}
                          className="whitespace-nowrap px-6 py-4 text-sm text-slate-700"
                        >
                          {column.render
                            ? column.render(
                                value,
                                row,
                              )
                            : String(
                                value ??
                                  "",
                              )}
                        </td>
                      );
                    },
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}