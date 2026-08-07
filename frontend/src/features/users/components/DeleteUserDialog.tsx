/**
 * Delete user dialog component.
 *
 * Displays a confirmation dialog before
 * permanently deleting a user.
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
export interface DeleteUserDialogProps {
  /**
   * Dialog visibility.
   */
  readonly open: boolean;

  /**
   * User name.
   */
  readonly userName?: string;

  /**
   * Close callback.
   */
  readonly onClose: () => void;

  /**
   * Delete callback.
   */
  readonly onConfirm: () => void | Promise<void>;

  /**
   * Indicates deletion in progress.
   */
  readonly isDeleting?: boolean;
}

/**
 * Delete user dialog.
 *
 * @param props Component properties.
 * @returns Delete confirmation dialog.
 */
export function DeleteUserDialog({
  open,
  userName,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteUserDialogProps): React.JSX.Element {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete User"
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
              Delete User
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {userName ?? "this user"}
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-red-600">
              This action cannot be undone.
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
            <Trash2 size={16} />

            Delete User
          </Button>
        </div>
      </div>
    </Modal>
  );
}