/**
 * Delete AI document confirmation dialog.
 */

import { useState } from "react";

import type { AIDocument } from "../types/aiDocument.types";

/**
 * Component properties.
 */
export interface DeleteAIDocumentDialogProps {
  /**
   * Document to delete.
   */
  readonly document: AIDocument;

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
  readonly onConfirm: (document: AIDocument) => Promise<void> | void;
}

/**
 * Delete AI document confirmation dialog.
 */
export function DeleteAIDocumentDialog({
  document: aiDocument,
  isOpen,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteAIDocumentDialogProps): React.JSX.Element | null {
  const [error, setError] = useState<string>();

  if (!isOpen) {
    return null;
  }

  /**
   * Handles document deletion.
   */
  const handleDelete = async (): Promise<void> => {
    setError(undefined);

    try {
      await onConfirm(aiDocument);
    } catch {
      setError("Unable to delete the document. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete Document
          </h2>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-gray-600">
            Are you sure you want to permanently delete this document?
          </p>

          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <div className="font-medium text-gray-900">
              {aiDocument.originalFilename}
            </div>

            <div className="mt-1 text-sm text-gray-600">
              {aiDocument.contentType}
            </div>

            <div className="mt-1 text-xs text-gray-500">
              Status: {aiDocument.status}
            </div>
          </div>

          <p className="text-sm text-red-600">
            This action cannot be undone.
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
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              void handleDelete();
            }}
            disabled={isDeleting}
            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Document"}
          </button>
        </div>
      </div>
    </div>
  );
}
