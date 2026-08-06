/**
 * Delete comment confirmation dialog.
 */

import { useState } from "react";

import type { Comment } from "../types/comment.types";

/**
 * Component properties.
 */
export interface DeleteCommentDialogProps {
  /**
   * Comment to delete.
   */
  readonly comment: Comment;

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
    comment: Comment,
  ) => Promise<void> | void;
}

/**
 * Delete comment confirmation dialog.
 */
export function DeleteCommentDialog({
  comment,
  isOpen,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteCommentDialogProps): React.JSX.Element | null {
  const [error, setError] =
    useState<string>();

  if (!isOpen) {
    return null;
  }

  /**
   * Handles comment deletion.
   */
  const handleDelete =
    async (): Promise<void> => {
      setError(undefined);

      try {
        await onConfirm(comment);
      } catch {
        setError(
          "Unable to delete the comment. Please try again.",
        );
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete Comment
          </h2>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete
            this comment?
          </p>

          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {comment.content.length > 200
                ? `${comment.content.slice(
                    0,
                    200,
                  )}...`
                : comment.content}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              <span className="font-medium">
                Author:
              </span>{" "}
              {comment.author.name}
            </p>

            <p>
              <span className="font-medium">
                Created:
              </span>{" "}
              {new Date(
                comment.createdAt,
              ).toLocaleString()}
            </p>
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
            {isDeleting
              ? "Deleting..."
              : "Delete Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}