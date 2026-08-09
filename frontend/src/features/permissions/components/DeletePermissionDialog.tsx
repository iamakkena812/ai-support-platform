/**
 * Permission deletion dialog.
 *
 * Provides confirmation before permanently deleting
 * a permission.
 */

import { useState } from "react";

import type { Permission } from "../types/permission.types";

/**
 * Delete permission dialog properties.
 */
export interface DeletePermissionDialogProps {
  /**
   * Permission to delete.
   */
  readonly permission: Permission | null;

  /**
   * Controls dialog visibility.
   */
  readonly open: boolean;

  /**
   * Indicates whether deletion is in progress.
   */
  readonly isDeleting?: boolean;

  /**
   * Called when the dialog should close.
   */
  readonly onClose: () => void;

  /**
   * Called when deletion is confirmed.
   */
  readonly onConfirm: (
    permission: Permission,
  ) => void | Promise<void>;
}

/**
 * Delete permission dialog.
 *
 * @param props - Component properties.
 * @returns Permission deletion confirmation dialog.
 */
export function DeletePermissionDialog({
  permission,
  open,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeletePermissionDialogProps) {
  const [error, setError] = useState<string | null>(
    null,
  );

  if (!open || permission === null) {
    return null;
  }

  const handleConfirm = async (): Promise<void> => {
    setError(null);

    try {
      await onConfirm(permission);
    } catch {
      setError(
        "Unable to delete this permission. Please try again.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-permission-title"
        aria-describedby="delete-permission-description"
      >
        <div>
          <h2
            id="delete-permission-title"
            className="text-lg font-semibold text-gray-900"
          >
            Delete permission
          </h2>

          <p
            id="delete-permission-description"
            className="mt-2 text-sm text-gray-600"
          >
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">
              {permission.name}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {error !== null && (
          <div
            className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              void handleConfirm();
            }}
            disabled={isDeleting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete Permission"}
          </button>
        </div>
      </div>
    </div>
  );
}