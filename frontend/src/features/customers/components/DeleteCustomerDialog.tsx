/**
 * Delete customer dialog component.
 *
 * Displays a confirmation dialog
 * before permanently deleting a customer.
 */

import {
  AlertTriangle,
  Trash2,
} from "lucide-react";

import {
  Button,
  Modal,
} from "../../../components/ui";

/**
 * Component properties.
 */
export interface DeleteCustomerDialogProps {
  /**
   * Indicates whether dialog is open.
   */
  readonly open: boolean;

  /**
   * Customer name.
   */
  readonly customerName?: string;

  /**
   * Close callback.
   */
  readonly onClose: () => void;

  /**
   * Confirm callback.
   */
  readonly onConfirm: () => void | Promise<void>;

  /**
   * Delete loading state.
   */
  readonly isDeleting?: boolean;
}

/**
 * Delete customer dialog component.
 *
 * @param props Component properties.
 * @returns Delete customer dialog.
 */
export function DeleteCustomerDialog({
  open,
  customerName,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteCustomerDialogProps): React.JSX.Element {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Customer"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle
              size={28}
              className="text-red-600"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Delete Customer
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {customerName ?? "this customer"}
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-red-600">
              This action cannot be undone.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Deleting this customer will remove the
              customer profile and associated customer
              records from the platform.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            loading={isDeleting}
            onClick={() => {
              void onConfirm();
            }}
          >
            <Trash2
              size={16}
            />

            Delete Customer
          </Button>
        </div>
      </div>
    </Modal>
  );
}