/**
 * Delete project confirmation dialog.
 */

import type {
  Project,
} from "../types/project.types";

interface DeleteProjectDialogProps {
  /**
   * Whether the dialog is open.
   */
  readonly open: boolean;

  /**
   * Project to delete.
   */
  readonly project: Project | null;

  /**
   * Loading state.
   */
  readonly isDeleting?: boolean;

  /**
   * Cancel callback.
   */
  readonly onCancel: () => void;

  /**
   * Confirm callback.
   */
  readonly onConfirm: (
    project: Project,
  ) => Promise<void> | void;
}

/**
 * Delete project dialog.
 */
export function DeleteProjectDialog({
  open,
  project,
  isDeleting = false,
  onCancel,
  onConfirm,
}: DeleteProjectDialogProps): React.JSX.Element | null {
  if (!open || !project) {
    return null;
  }

  const handleConfirm = async (): Promise<void> => {
    await onConfirm(project);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">
          Delete Project
        </h2>

        <p className="mt-4 text-gray-600">
          Are you sure you want to delete the
          following project?
        </p>

        <div className="mt-4 rounded border border-red-200 bg-red-50 p-4">
          <div className="font-medium">
            {project.name}
          </div>

          <div className="mt-1 text-sm text-gray-600">
            {project.description ??
              "No description"}
          </div>
        </div>

        <p className="mt-4 text-sm text-red-600">
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete Project"}
          </button>
        </div>
      </div>
    </div>
  );
}