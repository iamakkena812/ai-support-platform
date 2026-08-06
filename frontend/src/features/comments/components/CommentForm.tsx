/**
 * Comment form component.
 */

import {
  useEffect,
  useState,
} from "react";

import type { Comment } from "../types/comment.types";

/**
 * Comment form values.
 */
export interface CommentFormValues {
  /**
   * Ticket identifier.
   */
  readonly ticketId?: string;

  /**
   * Comment content.
   */
  readonly content: string;

  /**
   * Indicates whether the comment is internal.
   */
  readonly isInternal: boolean;
}

/**
 * Component properties.
 */
interface CommentFormProps {
  /**
   * Initial comment.
   */
  readonly initialValue?: Comment;

  /**
   * Submit handler.
   */
  readonly onSubmit: (
    values: CommentFormValues,
  ) => Promise<void> | void;

  /**
   * Loading state.
   */
  readonly isSubmitting?: boolean;
}

/**
 * Comment form.
 */
export function CommentForm({
  initialValue,
  onSubmit,
  isSubmitting = false,
}: CommentFormProps): React.JSX.Element {
  const [ticketId, setTicketId] =
    useState("");

  const [content, setContent] =
    useState("");

  const [isInternal, setIsInternal] =
    useState(false);

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setTicketId(
      initialValue.ticketId,
    );

    setContent(
      initialValue.content,
    );

    setIsInternal(
      initialValue.isInternal,
    );
  }, [initialValue]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    await onSubmit({
      ticketId: initialValue
        ? undefined
        : ticketId,
      content,
      isInternal,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {!initialValue ? (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Ticket ID
          </label>

          <input
            type="text"
            required
            value={ticketId}
            onChange={(event) =>
              setTicketId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Comment
        </label>

        <textarea
          required
          rows={6}
          value={content}
          onChange={(event) =>
            setContent(
              event.target.value,
            )
          }
          className="w-full rounded border border-gray-300 px-3 py-2"
          placeholder="Enter comment..."
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="isInternal"
          type="checkbox"
          checked={isInternal}
          onChange={(event) =>
            setIsInternal(
              event.target.checked,
            )
          }
          className="h-4 w-4 rounded border-gray-300"
        />

        <label
          htmlFor="isInternal"
          className="text-sm font-medium text-gray-700"
        >
          Internal comment
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialValue
              ? "Update Comment"
              : "Create Comment"}
        </button>
      </div>
    </form>
  );
}