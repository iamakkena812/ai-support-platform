/**
 * Permission card.
 *
 * Displays a permission entity in a compact card layout.
 */

import type { Permission } from "../types/permission.types";

/**
 * Permission card properties.
 */
export interface PermissionCardProps {
  /**
   * Permission to display.
   */
  readonly permission: Permission;

  /**
   * Optional selection callback.
   */
  readonly onSelect?: (
    permission: Permission,
  ) => void;
}

/**
 * Permission card.
 *
 * @param props - Component properties.
 * @returns Permission card.
 */
export function PermissionCard({
  permission,
  onSelect,
}: PermissionCardProps) {
  const isInteractive = onSelect !== undefined;

  return (
    <article
      className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${
        isInteractive
          ? "cursor-pointer transition-shadow hover:shadow-md"
          : ""
      }`}
      onClick={() => {
        onSelect?.(permission);
      }}
      onKeyDown={(event) => {
        if (
          isInteractive &&
          (event.key === "Enter" ||
            event.key === " ")
        ) {
          event.preventDefault();
          onSelect?.(permission);
        }
      }}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? "button" : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900">
            {permission.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {permission.description ??
              "No description available."}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          Permission
        </span>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="font-mono text-xs text-gray-500">
          {permission.id}
        </p>
      </div>
    </article>
  );
}