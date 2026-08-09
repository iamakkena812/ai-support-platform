/**
 * Permission form.
 *
 * Provides a reusable form for creating and updating
 * permissions.
 */

import { useEffect, useState } from "react";

import type {
  Permission,
  PermissionGroup,
} from "../types/permission.types";

/**
 * Permission form properties.
 */
export interface PermissionFormProps {
  /**
   * Existing permission for edit mode.
   */
  readonly permission?: Permission | null;

  /**
   * Available permission groups.
   */
  readonly groups?: readonly PermissionGroup[];

  /**
   * Indicates whether the form is submitting.
   */
  readonly isSubmitting?: boolean;

  /**
   * Indicates whether the form is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Called when the form is submitted.
   */
  readonly onSubmit: (
    values: PermissionFormValues,
  ) => void | Promise<void>;

  /**
   * Optional cancel callback.
   */
  readonly onCancel?: () => void;
}

/**
 * Permission form values.
 */
export interface PermissionFormValues {
  /**
   * Permission name.
   */
  readonly name: string;

  /**
   * Permission description.
   */
  readonly description: string;

  /**
   * Permission group identifier.
   */
  readonly groupId: string;
}

/**
 * Permission form.
 *
 * @param props - Component properties.
 * @returns Permission form.
 */
export function PermissionForm({
  permission = null,
  groups = [],
  isSubmitting = false,
  disabled = false,
  onSubmit,
  onCancel,
}: PermissionFormProps) {
  const [name, setName] = useState(
    permission?.name ?? "",
  );

  const [description, setDescription] = useState(
    permission?.description ?? "",
  );

  const [groupId, setGroupId] = useState("");

  const [error, setError] = useState<string | null>(
    null,
  );

  const isEditMode = permission !== null;

  useEffect(() => {
    setName(permission?.name ?? "");
    setDescription(permission?.description ?? "");
    setError(null);
  }, [permission]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription =
      description.trim();

    if (trimmedName.length === 0) {
      setError("Permission name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setError(
        "Permission name must not exceed 100 characters.",
      );
      return;
    }

    if (trimmedDescription.length > 500) {
      setError(
        "Description must not exceed 500 characters.",
      );
      return;
    }

    setError(null);

    await onSubmit({
      name: trimmedName,
      description: trimmedDescription,
      groupId,
    });
  };

  const isDisabled =
    disabled || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="permission-name"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Permission name
        </label>

        <input
          id="permission-name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          disabled={isDisabled}
          maxLength={100}
          required
          placeholder="Enter permission name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="permission-description"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="permission-description"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          disabled={isDisabled}
          maxLength={500}
          rows={4}
          placeholder="Describe what this permission allows."
          className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      {groups.length > 0 && (
        <div>
          <label
            htmlFor="permission-group"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Permission group
          </label>

          <select
            id="permission-group"
            value={groupId}
            onChange={(event) => {
              setGroupId(event.target.value);
            }}
            disabled={isDisabled}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="">
              No group
            </option>

            {groups.map((group) => (
              <option
                key={group.id}
                value={group.id}
              >
                {group.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error !== null && (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
        {onCancel !== undefined && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isDisabled}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isDisabled}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Permission"
              : "Create Permission"}
        </button>
      </div>
    </form>
  );
}