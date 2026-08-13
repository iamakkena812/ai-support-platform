/**
 * Permission table.
 *
 * Displays permissions in a structured tabular layout.
 */

import type { Permission } from "../types/permission.types";

/**
 * Permission table properties.
 */
export interface PermissionTableProps {
  /**
   * Permissions to display.
   */
  readonly permissions: readonly Permission[];

  /**
   * Indicates whether permission data is loading.
   */
  readonly isLoading?: boolean;

  /**
   * Optional permission selection callback.
   */
  readonly onSelect?: (
    permission: Permission,
  ) => void;
}

/**
 * Permission table.
 *
 * @param props - Component properties.
 * @returns Permission table.
 */
export function PermissionTable({
  permissions,
  isLoading = false,
  onSelect,
}: PermissionTableProps) {
  if (isLoading) {
    return (
      <div
        className="overflow-hidden rounded-lg border border-gray-200 bg-white"
        role="status"
        aria-label="Loading permissions"
      >
        <div className="p-6 text-sm text-gray-500">
          Loading permissions...
        </div>
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <p className="text-sm text-gray-500">
          No permissions found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Name
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Resource
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Action
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Description
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {permissions.map((permission) => (
            <tr
              key={permission.id}
              className={
                onSelect !== undefined
                  ? "cursor-pointer hover:bg-gray-50"
                  : undefined
              }
              onClick={() => {
                onSelect?.(permission);
              }}
              onKeyDown={(event) => {
                if (
                  onSelect !== undefined &&
                  (event.key === "Enter" ||
                    event.key === " ")
                ) {
                  event.preventDefault();
                  onSelect(permission);
                }
              }}
              tabIndex={
                onSelect !== undefined ? 0 : undefined
              }
              role={
                onSelect !== undefined
                  ? "button"
                  : undefined
              }
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {permission.name}
              </td>

              <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-gray-700">
                {permission.resource}
              </td>

              <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-gray-700">
                {permission.action}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {permission.description ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}