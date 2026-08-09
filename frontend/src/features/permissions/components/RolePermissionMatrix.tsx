/**
 * Role permission matrix.
 *
 * Provides an interface for assigning permissions
 * to a role.
 */

import type { PermissionGroup } from "../types/permission.types";

/**
 * Role permission matrix properties.
 */
export interface RolePermissionMatrixProps {
  /**
   * Permission groups available for assignment.
   */
  readonly groups: readonly PermissionGroup[];

  /**
   * Currently selected permission identifiers.
   */
  readonly selectedPermissionIds: readonly string[];

  /**
   * Indicates whether the matrix is loading.
   */
  readonly isLoading?: boolean;

  /**
   * Indicates whether permission selection is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Called when the selected permissions change.
   */
  readonly onChange: (
    permissionIds: readonly string[],
  ) => void;
}

/**
 * Role permission matrix.
 *
 * @param props - Component properties.
 * @returns Role permission assignment matrix.
 */
export function RolePermissionMatrix({
  groups,
  selectedPermissionIds,
  isLoading = false,
  disabled = false,
  onChange,
}: RolePermissionMatrixProps) {
  const selectedIds = new Set(
    selectedPermissionIds,
  );

  /**
   * Toggles a single permission.
   *
   * @param permissionId - Permission identifier.
   * @param selected - Whether the permission is selected.
   */
  const handlePermissionChange = (
    permissionId: string,
    selected: boolean,
  ): void => {
    const nextIds = new Set(selectedIds);

    if (selected) {
      nextIds.add(permissionId);
    } else {
      nextIds.delete(permissionId);
    }

    onChange(Array.from(nextIds));
  };

  /**
   * Toggles every permission in a group.
   *
   * @param group - Permission group.
   */
  const handleGroupChange = (
    group: PermissionGroup,
  ): void => {
    const groupPermissionIds =
      group.permissions.map(
        (permission) => permission.id,
      );

    const allSelected =
      groupPermissionIds.length > 0 &&
      groupPermissionIds.every((id) =>
        selectedIds.has(id),
      );

    const nextIds = new Set(selectedIds);

    if (allSelected) {
      groupPermissionIds.forEach((id) => {
        nextIds.delete(id);
      });
    } else {
      groupPermissionIds.forEach((id) => {
        nextIds.add(id);
      });
    }

    onChange(Array.from(nextIds));
  };

  if (isLoading) {
    return (
      <div
        className="rounded-lg border border-gray-200 bg-white p-6"
        role="status"
        aria-label="Loading role permissions"
      >
        <div className="space-y-4">
          {Array.from(
            { length: 4 },
            (_, index) => (
              <div
                key={index}
                className="space-y-3"
              >
                <div className="h-5 w-1/4 animate-pulse rounded bg-gray-200" />

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from(
                    { length: 3 },
                    (_, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="h-10 animate-pulse rounded bg-gray-100"
                      />
                    ),
                  )}
                </div>
              </div>
            ),
          )}
        </div>

        <span className="sr-only">
          Loading role permissions...
        </span>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          No permissions are available for assignment.
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      aria-label="Role permission matrix"
    >
      {groups.map((group) => {
        const permissionIds =
          group.permissions.map(
            (permission) => permission.id,
          );

        const selectedCount =
          permissionIds.filter((id) =>
            selectedIds.has(id),
          ).length;

        const allSelected =
          permissionIds.length > 0 &&
          selectedCount === permissionIds.length;

        const partiallySelected =
          selectedCount > 0 &&
          selectedCount < permissionIds.length;

        return (
          <section
            key={group.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4">
              <div>
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

              {permissionIds.length > 0 && (
                <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(element) => {
                      if (element !== null) {
                        element.indeterminate =
                          partiallySelected;
                      }
                    }}
                    disabled={disabled}
                    onChange={() => {
                      handleGroupChange(group);
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />

                  <span>
                    {selectedCount}/
                    {permissionIds.length}
                  </span>
                </label>
              )}
            </div>

            <div className="grid gap-2 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.permissions.map(
                (permission) => {
                  const isSelected =
                    selectedIds.has(
                      permission.id,
                    );

                  return (
                    <label
                      key={permission.id}
                      className={`flex items-start gap-3 rounded-md border p-3 ${
                        disabled
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:bg-gray-50"
                      } ${
                        isSelected
                          ? "border-gray-400 bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={disabled}
                        onChange={(event) => {
                          handlePermissionChange(
                            permission.id,
                            event.target.checked,
                          );
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300"
                      />

                      <span className="min-w-0">
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
                    </label>
                  );
                },
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}