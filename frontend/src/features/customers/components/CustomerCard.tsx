/**
 * Customer card component.
 */

import type {
  Customer,
} from "../types/customer.types";

interface CustomerCardProps {
  /**
   * Customer.
   */
  readonly customer: Customer;

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
 * Customer card.
 */
export function CustomerCard({
  customer,
  onView,
  onEdit,
  onDelete,
}: CustomerCardProps): React.JSX.Element {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {customer.firstName}{" "}
            {customer.lastName}
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            {customer.email}
          </p>

          <p className="mt-2 text-sm">
            <span className="font-medium">
              Company:
            </span>{" "}
            {customer.company ??
              "N/A"}
          </p>

          <p className="text-sm">
            <span className="font-medium">
              Phone:
            </span>{" "}
            {customer.phone ??
              "N/A"}
          </p>

          <p className="text-sm">
            <span className="font-medium">
              Status:
            </span>{" "}
            {customer.isActive
              ? "Active"
              : "Inactive"}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            customer.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {customer.isActive
            ? "Active"
            : "Inactive"}
        </span>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() =>
            onView?.(customer)
          }
          className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
        >
          View
        </button>

        <button
          type="button"
          onClick={() =>
            onEdit?.(customer)
          }
          className="rounded bg-amber-500 px-3 py-2 text-sm text-white hover:bg-amber-600"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete?.(customer)
          }
          className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </article>
  );
}