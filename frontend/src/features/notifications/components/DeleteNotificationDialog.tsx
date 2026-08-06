/**
 * Delete notification confirmation dialog.
 */

import { useState } from "react";

import type { Notification } from "../types/notification.types";

/**
 * Component properties.
 */
export interface DeleteNotificationDialogProps {
  /**
   * Notification to delete.
   */
  readonly notification: Notification;

  /**
   * Indicates whether the dialog is open.
   */
  readonly isOpen: boolean;

  /**
   * Indicates whether deletion is in progress.
   */
  readonly isDeleting?: boolean;

  /**
   * Invoked when the dialog is closed.
   */
  readonly onClose: () => void;

  /**
   * Invoked when deletion is confirmed.
   */
  readonly onConfirm: (
    notification: Notification,
  ) => Promise<void> | void;
}

/**
 * Delete notification confirmation dialog.
 */
export function DeleteNotificationDialog({
  notification,
  isOpen,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteNotificationDialogProps): React.JSX.Element | null {
  const [error, setError] =
    useState<string>();

  if (!isOpen) {
    return null;
  }

  /**
   * Handles notification deletion.
   */
  const handleDelete =
    async (): Promise<void> => {
      setError(undefined);

      try {
        await onConfirm(
          notification,
        );
      } catch {
        setError(
          "Unable to delete the notification. Please try again.",
        );
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete Notification
          </h2>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-gray-600">
            Are you sure you want to
            permanently delete this
            notification?
          </p>

          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <div className="font-medium text-gray-900">
              {
                notification.title
              }
            </div>

            <div className="mt-1 text-sm text-gray-600">
              {
                notification.message
              }
            </div>

            <div className="mt-2 inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
              {
                notification.type
              }
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-500">
            <p>
              <span className="font-medium">
                Recipient:
              </span>{" "}
              {
                notification
                  .recipient
                  .name
              }
            </p>

            <p>
              <span className="font-medium">
                Status:
              </span>{" "}
              {
                notification.status
              }
            </p>

            <p>
              <span className="font-medium">
                Created:
              </span>{" "}
              {new Date(
                notification.createdAt,
              ).toLocaleString()}
            </p>
          </div>

          <p className="text-sm text-red-600">
            This action cannot be
            undone.
          </p>

          {error ? (
            <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              void handleDelete();
            }}
            disabled={isDeleting}
            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete Notification"}
          </button>
        </div>
      </div>
    </div>
  );
}