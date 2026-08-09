/**
 * Permission tree.
 *
 * Displays permission groups and their permissions
 * in a hierarchical layout.
 */

import type {
  PermissionGroup,
} from "../types/permission.types";

/**
 * Permission tree properties.
 */
export interface PermissionTreeProps {
  /**
   * Permission groups to display.
   */
  readonly groups: readonly PermissionGroup[];

  /**
   * Selected permission identifiers.
   */
  readonly selectedPermissionIds?: readonly string[];

  /**
   * Whether selection controls should be displayed.
   */
  readonly selectable?: boolean;

  /**
   * Called when a permission selection changes.
   */
  readonly onSelectionChange?: (
    permissionId: string,
    selected: boolean,
  ) => void;
}

/**
 * Permission tree.
 *
 * @param props - Component properties.
 * @returns Permission hierarchy.
 */
export function PermissionTree({
  groups,
  selectedPermissionIds = [],
  selectable = false,
  onSelectionChange,
}: PermissionTreeProps) {
  const selectedIds = new Set(
    selectedPermissionIds,
  );

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          No permission groups available.
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      role={selectable ? "tree" : undefined}
      aria-label="Permission groups"
    >
      {groups.map((group) => (
        <section
          key={group.id}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white"
        >
          <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {group.name}
            </h3>

            {group.description !== null &&
              group.description !== undefined && (
                <p className="mt-1 text-xs text-gray-500">
                  {group.description}
                </p>
              )}
          </div>

          {group.permissions.length === 0 ? (
            <div className="px-5 py-4">
              <p className="text-sm text-gray-500">
                No permissions in this group.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {group.permissions.map(
                (permission) => {
                  const isSelected =
                    selectedIds.has(
                      permission.id,
                    );

                  return (
                    <li
                      key={permission.id}
                      className="px-5 py-3"
                      role={
                        selectable
                          ? "treeitem"
                          : undefined
                      }
                      aria-selected={
                        selectable
                          ? isSelected
                          : undefined
                      }
                    >
                      <label
                        className={`flex items-start gap-3 ${
                          selectable
                            ? "cursor-pointer"
                            : "cursor-default"
                        }`}
                      >
                        {selectable && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(event) => {
                              onSelectionChange?.(
                                permission.id,
                                event.target.checked,
                              );
                            }}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300"
                          />
                        )}

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-gray-900">
                            {permission.name}
                          </span>

                          {permission.description !==
                            null &&
                            permission.description !==
                              undefined && (
                              <span className="mt-1 block text-xs text-gray-500">
                                {
                                  permission.description
                                }
                              </span>
                            )}
                        </span>

                        <span className="shrink-0 font-mono text-xs text-gray-400">
                          {permission.id}
                        </span>
                      </label>
                    </li>
                  );
                },
              )}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}