/**
 * Edit permission page.
 *
 * Provides the workflow for updating an existing permission.
 */

import { useNavigate, useParams } from "react-router-dom";

import {
  PermissionForm,
  PermissionHeader,
} from "../components";

import {
  usePermission,
  usePermissionGroups,
  useUpdatePermission,
} from "../hooks/usePermissions";

import type {
  PermissionFormValues,
} from "../components/PermissionForm";

import type {
  UpdatePermissionRequest,
} from "../types/permission.types";

/**
 * Edit permission page.
 *
 * @returns Permission edit page.
 */
export function EditPermissionPage() {
  const navigate = useNavigate();
  const { id = "" } = useParams<{
    readonly id: string;
  }>();

  const {
    data: permission,
    isLoading: isPermissionLoading,
    isError: isPermissionError,
    error: permissionError,
  } = usePermission(id);

  const {
    data: groupData,
    isLoading: isGroupsLoading,
  } = usePermissionGroups();

  const {
    mutateAsync: updatePermission,
    isPending,
    isError: isUpdateError,
    error: updateError,
  } = useUpdatePermission();

  const handleSubmit = async (
    values: PermissionFormValues,
  ): Promise<void> => {
    if (permission === undefined) {
      return;
    }

    const payload: UpdatePermissionRequest = {
      name: values.name,
      description:
        values.description.length > 0
          ? values.description
          : null,
      groupId:
        values.groupId.length > 0
          ? values.groupId
          : null,
    };

    const updatedPermission =
      await updatePermission({
        id: permission.id,
        payload,
      });

    navigate(
      `/permissions/${updatedPermission.id}`,
    );
  };

  if (isPermissionLoading) {
    return (
      <div className="space-y-6">
        <PermissionHeader
          title="Edit Permission"
          description="Update permission configuration."
        />

        <div
          className="rounded-lg border border-gray-200 bg-white p-6"
          role="status"
          aria-label="Loading permission"
        >
          <div className="space-y-5">
            <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-1/4 animate-pulse rounded bg-gray-200" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-100" />
          </div>

          <span className="sr-only">
            Loading permission...
          </span>
        </div>
      </div>
    );
  }

  if (
    isPermissionError ||
    permission === undefined
  ) {
    const message =
      permissionError instanceof Error
        ? permissionError.message
        : "Unable to load this permission.";

    return (
      <div className="space-y-6">
        <PermissionHeader
          title="Edit Permission"
          description="Update permission configuration."
        />

        <div
          className="rounded-lg border border-red-200 bg-red-50 p-6"
          role="alert"
        >
          <h2 className="text-sm font-semibold text-red-800">
            Unable to load permission
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {message}
          </p>

          <button
            type="button"
            onClick={() => {
              navigate("/permissions");
            }}
            className="mt-4 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Back to Permissions
          </button>
        </div>
      </div>
    );
  }

  const updateErrorMessage =
    updateError instanceof Error
      ? updateError.message
      : "Unable to update permission. Please try again.";

  return (
    <div className="space-y-6">
      <PermissionHeader
        title="Edit Permission"
        description={`Update the ${permission.name} permission.`}
      />

      {isUpdateError && (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {updateErrorMessage}
        </div>
      )}

      <PermissionForm
        permission={permission}
        groups={groupData?.items ?? []}
        isSubmitting={isPending}
        disabled={isGroupsLoading}
        onSubmit={handleSubmit}
        onCancel={() => {
          navigate(`/permissions/${permission.id}`);
        }}
      />
    </div>
  );
}