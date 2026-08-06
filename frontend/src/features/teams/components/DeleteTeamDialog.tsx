/**
 * Delete team dialog.
 */

import type {
  Team,
} from "../types/team.types";

export interface DeleteTeamDialogProps {
  /**
   * Whether the dialog is open.
   */
  readonly open: boolean;

  /**
   * Team to delete.
   */
  readonly team?: Team;

  /**
   * Loading state.
   */
  readonly isLoading?: boolean;

  /**
   * Confirm callback.
   */
  readonly onConfirm: () => void;

  /**
   * Cancel callback.
   */
  readonly onCancel: () => void;
}

/**
 * Delete team dialog.
 */
export function DeleteTeamDialog({
  open,
  team,
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteTeamDialogProps): React.JSX.Element | null {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">
          Delete Team
        </h2>

        <p className="mt-4 text-slate-600">
          Are you sure you want to delete{" "}
          <strong>{team?.name}</strong>?
        </p>

        <p className="mt-2 text-sm text-red-600">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}