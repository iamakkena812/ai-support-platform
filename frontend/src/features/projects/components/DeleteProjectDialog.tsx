/**
 * Delete project dialog component.
 *
 * Displays a confirmation dialog
 * before permanently deleting a project.
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
export interface DeleteProjectDialogProps {
  /**
   * Indicates whether the dialog is open.
   */
  readonly open: boolean;

  /**
   * Project name.
   */
  readonly projectName?: string;

  /**
   * Close callback.
   */
  readonly onClose: () => void;

  /**
   * Confirm callback.
   */
  readonly onConfirm: () => void | Promise<void>;

  /**
   * Indicates deletion state.
   */
  readonly isDeleting?: boolean;
}

/**
 * Delete project dialog component.
 *
 * @param props Component properties.
 * @returns Delete project dialog.
 */
export function DeleteProjectDialog({
  open,
  projectName,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteProjectDialogProps): React.JSX.Element {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Project"
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
              Delete Project
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {projectName ?? "this project"}
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-red-600">
              This action cannot be undone.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Deleting this project will permanently
              remove all associated project metadata,
              milestones, assignments, and related
              records that are not referenced by other
              resources.
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

            Delete Project
          </Button>
        </div>
      </div>
    </Modal>
  );
}