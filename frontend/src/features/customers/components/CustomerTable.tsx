/**
 * Customer table component.
 */

import type {
  Customer,
} from "../types/customer.types";

interface CustomerTableProps {
  /**
   * Customers.
   */
  readonly customers: readonly Customer[];

  /**
   * View callback.
   */
  readonly onView?: (
    customer: Customer,
  ) => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: (
    customer: Customer,
  ) => void;

  /**
   * Delete callback.
   */
  readonly onDelete?: (
    customer: Customer,
  ) => void;
}

/**
 * Customer table.
 */
export function CustomerTable({
  customers,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Name
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Email
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Company
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Phone
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {customers.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-6 text-center text-gray-500"
              >
                No customers found.
              </td>
            </tr>
          ) : (
            customers.map(
              (customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3">
                    {customer.firstName}{" "}
                    {customer.lastName}
                  </td>

                  <td className="px-4 py-3">
                    {customer.email}
                  </td>

                  <td className="px-4 py-3">
                    {customer.company ??
                      "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {customer.phone ??
                      "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        customer.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {customer.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onView?.(
                            customer,
                          )
                        }
                        className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onEdit?.(
                            customer,
                          )
                        }
                        className="rounded bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete?.(
                            customer,
                          )
                        }
                        className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )
          )}
        </tbody>
      </table>
    </div>
  );
}