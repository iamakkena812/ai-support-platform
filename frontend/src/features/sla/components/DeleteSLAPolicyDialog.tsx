/**
 * Delete SLA policy confirmation dialog.
 */

import type { FC } from "react";

import type { SLAPolicy } from "../types/sla.types";

/**
 * Component properties.
 */
export interface DeleteSLAPolicyDialogProps {
  /**
   * Policy to delete.
   */
  readonly policy: SLAPolicy;

  /**
   * Whether the dialog is open.
   */
  readonly isOpen: boolean;

  /**
   * Whether the deletion is in progress.
   */
  readonly isDeleting?: boolean;

  /**
   * Invoked when the dialog is closed without confirming.
   */
  readonly onClose: () => void;

  /**
   * Invoked when the deletion is confirmed.
   */
  readonly onConfirm: (policy: SLAPolicy) => void | Promise<void>;
}

/**
 * Delete SLA policy confirmation dialog.
 *
 * @param props - Component properties.
 * @returns Dialog component.
 */
export const DeleteSLAPolicyDialog: FC<DeleteSLAPolicyDialogProps> = ({
  policy,
  isOpen,
  isDeleting = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">
          Delete SLA policy
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete &quot;{policy.name}&quot;? This
          cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void onConfirm(policy)}
            disabled={isDeleting}
            className="rounded bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
