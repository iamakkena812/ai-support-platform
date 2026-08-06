/**
 * Organization table component.
 */

import type {
  Organization,
} from "../types/organization.types";

export interface OrganizationTableProps {
  /**
   * Organizations.
   */
  readonly organizations: readonly Organization[];

  /**
   * View callback.
   */
  readonly onView?: (
    organization: Organization,
  ) => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: (
    organization: Organization,
  ) => void;

  /**
   * Delete callback.
   */
  readonly onDelete?: (
    organization: Organization,
  ) => void;
}

/**
 * Organization table.
 */
export function OrganizationTable({
  organizations,
  onView,
  onEdit,
  onDelete,
}: OrganizationTableProps): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Name
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Description
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Created
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {organizations.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-10 text-center text-slate-500"
              >
                No organizations found.
              </td>
            </tr>
          ) : (
            organizations.map((organization) => (
              <tr
                key={organization.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium">
                  {organization.name}
                </td>

                <td className="px-6 py-4">
                  {organization.description ??
                    "-"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      organization.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {organization.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {new Date(
                    organization.createdAt,
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onView?.(organization)
                      }
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onEdit?.(organization)
                      }
                      className="rounded bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete?.(organization)
                      }
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}