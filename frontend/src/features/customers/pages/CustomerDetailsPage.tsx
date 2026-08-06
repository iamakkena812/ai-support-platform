/**
 * Customer details page.
 */

import { Link, useParams } from "react-router-dom";

import { useCustomer } from "../hooks/useCustomer";

/**
 * Customer details page.
 */
export function CustomerDetailsPage(): React.JSX.Element {
  const { customerId = "" } =
    useParams<{
      customerId: string;
    }>();

  const {
    data,
    isLoading,
    isError,
  } = useCustomer(customerId);

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 text-center">
        Loading customer...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg bg-white p-8 text-center">
        <h2 className="text-xl font-semibold">
          Customer not found
        </h2>

        <Link
          to="/customers"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Customers
        </Link>
      </div>
    );
  }

  const { customer } = data;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Customer Details
          </h1>

          <p className="text-gray-600">
            View customer information.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/customers/${customer.id}/edit`}
            className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
          >
            Edit
          </Link>

          <Link
            to="/customers"
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-6 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">
              First Name
            </dt>

            <dd className="mt-1 text-lg">
              {customer.firstName}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Last Name
            </dt>

            <dd className="mt-1 text-lg">
              {customer.lastName}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Email
            </dt>

            <dd className="mt-1">
              {customer.email}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Phone
            </dt>

            <dd className="mt-1">
              {customer.phone ??
                "N/A"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Company
            </dt>

            <dd className="mt-1">
              {customer.company ??
                "N/A"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Status
            </dt>

            <dd className="mt-1">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  customer.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {customer.isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Organization ID
            </dt>

            <dd className="mt-1 break-all">
              {customer.organizationId}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Customer ID
            </dt>

            <dd className="mt-1 break-all">
              {customer.id}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Created At
            </dt>

            <dd className="mt-1">
              {customer.createdAt}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Updated At
            </dt>

            <dd className="mt-1">
              {customer.updatedAt}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}