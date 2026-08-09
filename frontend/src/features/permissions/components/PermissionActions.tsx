/**
 * Permission actions.
 *
 * Provides primary actions for the Permissions feature.
 */

import { Link } from "react-router-dom";

import { Button } from "../../../components/ui/Button";

/**
 * Permission action properties.
 */
export interface PermissionActionsProps {
  /**
   * Whether the current user can create permissions.
   */
  readonly canCreate?: boolean;

  /**
   * Whether the current user can manage permissions.
   */
  readonly canManage?: boolean;

  /**
   * Optional callback for refreshing permission data.
   */
  readonly onRefresh?: () => void;
}

/**
 * Permission actions.
 *
 * @param props - Component properties.
 * @returns Permission action controls.
 */
export function PermissionActions({
  canCreate = false,
  canManage = false,
  onRefresh,
}: PermissionActionsProps) {
  const canAddPermission = canCreate || canManage;

  return (
    <div className="flex items-center gap-2">
      {onRefresh !== undefined && (
        <Button
          type="button"
          variant="secondary"
          onClick={onRefresh}
        >
          Refresh
        </Button>
      )}

      {canAddPermission && (
        <Link
          to="/permissions/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Create Permission
        </Link>
      )}
    </div>
  );
}