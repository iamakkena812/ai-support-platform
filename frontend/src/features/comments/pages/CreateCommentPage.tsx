/**
 * Create comment page.
 */

import { useNavigate } from "react-router-dom";

import {
  CommentForm,
} from "../components/CommentForm";
import {
  useCreateComment,
} from "../hooks/useComments";

import type {
  CommentFormValues,
} from "../components/CommentForm";

/**
 * Create comment page.
 */
export function CreateCommentPage(): React.JSX.Element {
  const navigate = useNavigate();

  const createCommentMutation =
    useCreateComment();

  /**
   * Handles comment creation.
   *
   * @param values - Comment form values.
   */
  const handleSubmit = async (
    values: CommentFormValues,
  ): Promise<void> => {
    await createCommentMutation.mutateAsync({
      ticketId:
        values.ticketId ?? "",
      content:
        values.content,
      isInternal:
        values.isInternal,
    });

    navigate("/comments");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Create Comment
        </h1>

        <p className="mt-2 text-gray-600">
          Add a new comment to a support ticket.
        </p>
      </div>

      <CommentForm
        onSubmit={
          handleSubmit
        }
        isSubmitting={
          createCommentMutation.isPending
        }
      />
    </div>
  );
}