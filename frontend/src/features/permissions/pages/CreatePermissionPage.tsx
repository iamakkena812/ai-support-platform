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

  const handleSubmit = async (
    values: PermissionFormValues,
  ): Promise<void> => {
    const payload: CreatePermissionRequest = {
      name: values.name,
      resource: values.resource,
      action: values.action,
      description:
        values.description.length > 0
          ? values.description
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
        isSubmitting={isPending}
        onSubmit={handleSubmit}
        onCancel={() => {
          navigate("/permissions");
        }}
      />
    </div>
  );
}
