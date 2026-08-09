/**
 * Permission status badge.
 *
 * Displays the current assignment status of a permission.
 */

export type PermissionStatus =
  | "ASSIGNED"
  | "UNASSIGNED";

/**
 * Permission status badge properties.
 */
export interface PermissionStatusBadgeProps {
  /**
   * Permission assignment status.
   */
  readonly status: PermissionStatus;

  /**
   * Optional number of roles using the permission.
   */
  readonly roleCount?: number;
}

/**
 * Permission status badge.
 *
 * @param props - Component properties.
 * @returns Permission status badge.
 */
export function PermissionStatusBadge({
  status,
  roleCount,
}: PermissionStatusBadgeProps) {
  const isAssigned = status === "ASSIGNED";

  return (
    <span
      className={
        isAssigned
          ? "inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
          : "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
      }
      title={
        roleCount !== undefined
          ? `${roleCount} role${roleCount === 1 ? "" : "s"}`
          : undefined
      }
    >
      {isAssigned ? "Assigned" : "Unassigned"}
    </span>
  );
}