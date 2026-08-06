/**
 * Recent customers component.
 */

import type {
  DashboardCustomer,
} from "../types/dashboard.types";

/**
 * Component properties.
 */
export interface RecentCustomersProps {
  /**
   * Recent customers.
   */
  readonly customers: readonly DashboardCustomer[];
}

/**
 * Recent customers.
 *
 * @param props - Component properties.
 * @returns Recent customers component.
 */
export function RecentCustomers({
  customers,
}: RecentCustomersProps): React.JSX.Element {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Customers
        </h2>
      </div>

      {customers.length ===
      0 ? (
        <div className="p-8 text-center text-gray-500">
          No recent customers.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {customers.map(
            (
              customer,
            ) => (
              <div
                key={
                  customer.id
                }
                className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-gray-900">
                    {
                      customer.name
                    }
                  </h3>

                  <p className="mt-1 truncate text-sm text-gray-600">
                    {
                      customer.email
                    }
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {
                      customer.company
                    }
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  {new Date(
                    customer.createdAt,
                  ).toLocaleDateString()}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}