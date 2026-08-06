/**
 * Delete customer dialog component.
 */

import type {
  Customer,
} from "../types/customer.types";

interface DeleteCustomerDialogProps {
  /**
   * Whether the dialog is open.
   */
  readonly open: boolean;

  /**
   * Customer to delete.
   */
  readonly customer: Customer | null;

  /**
   * Loading state.
   */
  readonly isDeleting?: boolean;

  /**
   * Confirm callback.
   */
  readonly onConfirm: (
    customer: Customer,
  ) => Promise<void> | void;

  /**
   * Cancel callback.
   */
  readonly onCancel: () => void;
}

/**
 * Delete customer confirmation dialog.
 */
export function DeleteCustomerDialog({
  open,
  customer,
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteCustomerDialogProps): React.JSX.Element | null {
  if (
    !open ||
    customer === null
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          Delete Customer
        </h2>

        <p className="mt-4 text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {customer.firstName}{" "}
            {customer.lastName}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-red-600">
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              void onConfirm(
                customer,
              )
            }
            disabled={isDeleting}
            className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}