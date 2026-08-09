/**
 * Permission group card.
 *
 * Displays a permission group and the permissions
 * belonging to that group.
 */

import type {
  PermissionGroup,
} from "../types/permission.types";

/**
 * Permission group card properties.
 */
export interface PermissionGroupCardProps {
  /**
   * Permission group to display.
   */
  readonly group: PermissionGroup;

  /**
   * Optional permission selection callback.
   */
  readonly onPermissionSelect?: (
    permissionId: string,
  ) => void;
}

/**
 * Permission group card.
 *
 * @param props - Component properties.
 * @returns Permission group card.
 */
export function PermissionGroupCard({
  group,
  onPermissionSelect,
}: PermissionGroupCardProps) {
  return (
    <section
      className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
      aria-labelledby={`permission-group-${group.id}`}
    >
      <div className="border-b border-gray-100 pb-4">
        <h3
          id={`permission-group-${group.id}`}
          className="text-base font-semibold text-gray-900"
        >
          {group.name}
        </h3>

        {group.description !== null &&
          group.description !== undefined && (
            <p className="mt-1 text-sm text-gray-500">
              {group.description}
            </p>
          )}
      </div>

      {group.permissions.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          No permissions in this group.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-gray-100">
          {group.permissions.map((permission) => {
            const isInteractive =
              onPermissionSelect !== undefined;

            return (
              <li key={permission.id}>
                <button
                  type="button"
                  disabled={!isInteractive}
                  onClick={() => {
                    onPermissionSelect?.(
                      permission.id,
                    );
                  }}
                  className={`flex w-full items-start justify-between gap-4 py-3 text-left ${
                    isInteractive
                      ? "cursor-pointer hover:bg-gray-50"
                      : "cursor-default"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-gray-900">
                      {permission.name}
                    </span>

                    {permission.description !==
                      null &&
                      permission.description !==
                        undefined && (
                        <span className="mt-1 block text-xs text-gray-500">
                          {permission.description}
                        </span>
                      )}
                  </span>

                  <span className="shrink-0 font-mono text-xs text-gray-400">
                    {permission.id}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}