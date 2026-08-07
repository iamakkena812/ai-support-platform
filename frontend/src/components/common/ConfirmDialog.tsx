/**
 * Confirmation dialog component.
 *
 * Displays a reusable confirmation dialog.
 */

export interface ConfirmDialogProps {
  /**
   * Dialog title.
   */
  readonly title: string;

  /**
   * Dialog message.
   */
  readonly message: string;

  /**
   * Whether the dialog is open.
   */
  readonly open: boolean;

  /**
   * Loading state.
   */
  readonly isLoading?: boolean;

  /**
   * Confirm action.
   */
  readonly onConfirm: () => void;

  /**
   * Cancel action.
   */
  readonly onCancel: () => void;
}

/**
 * Confirmation dialog.
 *
 * @param props Component properties.
 * @returns Confirmation dialog.
 */
export function ConfirmDialog({
  title,
  message,
  open,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps): React.JSX.Element {
  if (!open) {
    return <></>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
        </div>

        <div className="px-6 py-5">
          <p className="text-slate-600">
            {message}
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-slate-300 px-4 py-2 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading
              ? "Please wait..."
              : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}