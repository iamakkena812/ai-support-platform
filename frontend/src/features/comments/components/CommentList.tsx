/**
 * Comment list component.
 *
 * Displays a collection of comments.
 */

import type { FC } from "react";

import { CommentCard } from "./CommentCard";

import type { Comment } from "../types/comment.types";

/**
 * Component properties.
 */
export interface CommentListProps {
  /**
   * Collection of comments.
   */
  readonly comments: readonly Comment[];

  /**
   * Invoked when a comment is selected.
   */
  readonly onView?: (
    comment: Comment,
  ) => void;

  /**
   * Invoked when editing a comment.
   */
  readonly onEdit?: (
    comment: Comment,
  ) => void;

  /**
   * Invoked when deleting a comment.
   */
  readonly onDelete?: (
    comment: Comment,
  ) => void;
}

/**
 * Comment list.
 *
 * @param props - Component properties.
 * @returns Comment list component.
 */
export const CommentList: FC<CommentListProps> = ({
  comments,
  onView,
  onEdit,
  onDelete,
}) => {
  if (comments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        No comments found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-lg border border-transparent transition-colors hover:border-gray-200"
        >
          <CommentCard
            comment={comment}
            onClick={onView}
          />

          <div className="flex justify-end gap-2 border-x border-b border-gray-200 rounded-b-lg bg-gray-50 px-4 py-3">
            <button
              type="button"
              onClick={() =>
                onView?.(comment)
              }
              className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100"
            >
              View
            </button>

            <button
              type="button"
              onClick={() =>
                onEdit?.(comment)
              }
              className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-50"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete?.(comment)
              }
              className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};