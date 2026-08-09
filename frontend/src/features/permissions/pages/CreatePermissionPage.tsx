/**
 * Create permission page.
 *
 * Provides the workflow for creating a new permission.
 */

import { useNavigate } from "react-router-dom";

import {
  PermissionForm,
  PermissionHeader,
} from "../components";

import {
  useCreatePermission,
  usePermissionGroups,
} from "../hooks/usePermissions";

import type {
  PermissionFormValues,
} from "../components/PermissionForm";

import type {
  CreatePermissionRequest,
} from "../types/permission.types";

/**
 * Create permission page.
 *
 * @returns Permission creation page.
 */
export function CreatePermissionPage() {
  const navigate = useNavigate();

  const {
    mutateAsync: createPermission,
    isPending,
    isError,
    error,
  } = useCreatePermission();

  const {
    data: groupData,
    isLoading: isGroupsLoading,
  } = usePermissionGroups();

  const handleSubmit = async (
    values: PermissionFormValues,
  ): Promise<void> => {
    const payload: CreatePermissionRequest = {
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

    const permission =
      await createPermission(payload);

    navigate(
      `/permissions/${permission.id}`,
    );
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Unable to create permission. Please try again.";

  return (
    <div className="space-y-6">
      <PermissionHeader
        title="Create Permission"
        description="Create a new permission for the platform."
      />

      {isError && (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <PermissionForm
        groups={groupData?.items ?? []}
        isSubmitting={isPending}
        disabled={isGroupsLoading}
        onSubmit={handleSubmit}
        onCancel={() => {
          navigate("/permissions");
        }}
      />
    </div>
  );
}