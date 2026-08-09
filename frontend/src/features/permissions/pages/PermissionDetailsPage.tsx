/**
 * Permission details page.
 *
 * Displays a permission and provides management actions.
 */

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  DeletePermissionDialog,
  PermissionActions,
  PermissionDetails,
  PermissionError,
  PermissionHeader,
  PermissionSummary,
} from "../components";

import {
  useDeletePermission,
  usePermission,
} from "../hooks/usePermissions";

/**
 * Permission details page.
 *
 * @returns Permission details page.
 */
export function PermissionDetailsPage() {
  const navigate = useNavigate();

  const { id = "" } = useParams<{
    readonly id: string;
  }>();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

  const {
    data: permission,
    isLoading,
    isError,
    error,
    refetch,
  } = usePermission(id);

  const {
    mutateAsync: deletePermission,
    isPending: isDeleting,
  } = useDeletePermission();

  const handleDelete = async (): Promise<void> => {
    if (permission === undefined) {
      return;
    }

    await deletePermission(permission.id);

    setIsDeleteDialogOpen(false);
    navigate("/permissions");
  };

  const handleRefresh = (): void => {
    void refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PermissionHeader
          title="Permission Details"
          description="View permission configuration and access information."
        />

        <PermissionDetails
          permission={null}
          isLoading
        />
      </div>
    );
  }

  if (
    isError ||
    permission === undefined
  ) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to load this permission.";

    return (
      <div className="space-y-6">
        <PermissionHeader
          title="Permission Details"
          description="View permission configuration and access information."
        />

        <PermissionError
          message={errorMessage}
          onRetry={handleRefresh}
        />

        <div>
          <Link
            to="/permissions"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to Permissions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PermissionHeader
        title="Permission Details"
        description="View and manage permission configuration."
        actions={
          <div className="flex items-center gap-2">
            <PermissionActions
              canManage
              onRefresh={handleRefresh}
            />

            <Link
              to={`/permissions/${permission.id}/edit`}
              className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsDeleteDialogOpen(true);
              }}
              className="inline-flex items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        }
      />

      <PermissionSummary
        permission={permission}
      />

      <PermissionDetails
        permission={permission}
      />

      <div>
        <Link
          to="/permissions"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Permissions
        </Link>
      </div>

      <DeletePermissionDialog
        permission={permission}
        open={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(false);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}