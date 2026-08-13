/**
 * Customer table component.
 *
 * Displays customers in a
 * responsive table layout.
 */

import {
  Building2,
  Mail,
  Phone,
} from "lucide-react";

import {
  CustomerActions,
} from "./CustomerActions";

import {
  CustomerStatusBadge,
} from "./CustomerStatusBadge";

import type {
  CustomerStatus,
} from "../types/customer.types";

/**
 * Customer table row.
 */
export interface CustomerTableRow {
  /**
   * Customer identifier.
   */
  readonly id: string;

  /**
   * Customer name.
   */
  readonly name: string;

  /**
   * Company name.
   */
  readonly companyName?: string | null;

  /**
   * Email.
   */
  readonly email: string;

  /**
   * Phone.
   */
  readonly phone?: string | null;

  /**
   * Status.
   */
  readonly status: CustomerStatus;
}

/**
 * Component properties.
 */
export interface CustomerTableProps {
  /**
   * Customers.
   */
  readonly customers: readonly CustomerTableRow[];

  /**
   * View callback.
   */
  readonly onView?: (
    id: string,
  ) => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: (
    id: string,
  ) => void;

  /**
   * Delete callback.
   */
  readonly onDelete?: (
    id: string,
  ) => void;
}

/**
 * Customer table component.
 *
 * @param props Component properties.
 * @returns Customer table.
 */
export function CustomerTable({
  customers,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="min-w-full">

        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              Customer
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              Contact
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              Company
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
              Status
            </th>

            <th className="w-20 px-6 py-4 text-right text-sm font-semibold text-slate-700">
              Actions
            </th>
          </tr>
        </thead>


        <tbody className="divide-y divide-slate-200">

          {customers.map(
            (customer) => (
              <tr
                key={
                  customer.id
                }
                className="transition hover:bg-slate-50"
              >

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                      {
                        customer.name
                          .charAt(0)
                          .toUpperCase()
                      }
                    </div>

                    <span className="font-medium text-slate-900">
                      {
                        customer.name
                      }
                    </span>

                  </div>
                </td>


                <td className="px-6 py-4">
                  <div className="space-y-2 text-sm text-slate-600">

                    <div className="flex items-center gap-2">
                      <Mail
                        size={14}
                      />

                      {
                        customer.email
                      }
                    </div>


                    {customer.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone
                          size={14}
                        />

                        {
                          customer.phone
                        }
                      </div>
                    ) : null}

                  </div>
                </td>


                <td className="px-6 py-4 text-sm text-slate-700">
                  <div className="flex items-center gap-2">

                    <Building2
                      size={15}
                    />

                    {
                      customer.companyName ??
                      "-"
                    }

                  </div>
                </td>


                <td className="px-6 py-4 text-center">
                  <CustomerStatusBadge
                    status={
                      customer.status
                    }
                  />
                </td>


                <td className="px-6 py-4 text-right">

                  <CustomerActions
                    onView={
                      onView
                        ? () =>
                            onView(
                              customer.id,
                            )
                        : undefined
                    }

                    onEdit={
                      onEdit
                        ? () =>
                            onEdit(
                              customer.id,
                            )
                        : undefined
                    }

                    onDelete={
                      onDelete
                        ? () =>
                            onDelete(
                              customer.id,
                            )
                        : undefined
                    }
                  />

                </td>

              </tr>
            ),
          )}

        </tbody>

      </table>
    </div>
  );
}
