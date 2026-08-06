/**
 * Comment card component.
 *
 * Displays a comment in a reusable card layout.
 */

import type { FC } from "react";

import type { Comment } from "../types/comment.types";

/**
 * Component properties.
 */
export interface CommentCardProps {
  /**
   * Comment to display.
   */
  readonly comment: Comment;

  /**
   * Invoked when the card is selected.
   */
  readonly onClick?: (
    comment: Comment,
  ) => void;
}

/**
 * Comment card.
 *
 * @param props - Component properties.
 * @returns Comment card component.
 */
export const CommentCard: FC<CommentCardProps> = ({
  comment,
  onClick,
}) => (
  <div
    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={() => onClick?.(comment)}
    onKeyDown={(event) => {
      if (
        onClick &&
        (event.key === "Enter" ||
          event.key === " ")
      ) {
        event.preventDefault();
        onClick(comment);
      }
    }}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-gray-900">
          {comment.author.name}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {new Date(
            comment.createdAt,
          ).toLocaleString()}
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          comment.isInternal
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {comment.isInternal
          ? "Internal"
          : "Public"}
      </span>
    </div>

    <div className="mt-4">
      <p className="whitespace-pre-wrap text-sm text-gray-700">
        {comment.content}
      </p>
    </div>

    {comment.ticket ? (
      <div className="mt-5 border-t pt-3 text-xs text-gray-500">
        <span className="font-medium">
          Ticket:
        </span>{" "}
        {comment.ticket.ticketNumber} —{" "}
        {comment.ticket.title}
      </div>
    ) : null}

    <div className="mt-2 text-xs text-gray-500">
      Updated{" "}
      {new Date(
        comment.updatedAt,
      ).toLocaleString()}
    </div>
  </div>
);