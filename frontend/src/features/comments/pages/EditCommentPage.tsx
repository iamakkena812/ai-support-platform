/**
 * Edit comment page.
 */

import { useNavigate, useParams } from "react-router-dom";

import { CommentForm } from "../components/CommentForm";
import { useComment } from "../hooks/useComment";
import { useUpdateComment } from "../hooks/useComments";

import type { CommentFormValues } from "../components/CommentForm";

/**
 * Edit comment page.
 */
export function EditCommentPage(): React.JSX.Element {
  const navigate = useNavigate();

  const { commentId = "" } = useParams<{
    commentId: string;
  }>();

  const {
    data: comment,
    isLoading,
    isError,
    error,
  } = useComment(commentId);

  const updateCommentMutation =
    useUpdateComment();

  /**
   * Handles comment update.
   *
   * @param values - Comment form values.
   */
  const handleSubmit = async (
    values: CommentFormValues,
  ): Promise<void> => {
    await updateCommentMutation.mutateAsync({
      commentId,
      payload: {
        content: values.content,
        isInternal:
          values.isInternal,
      },
    });

    navigate("/comments");
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading comment...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load comment."}
      </div>
    );
  }

  if (!comment) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Comment not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Comment
        </h1>

        <p className="mt-2 text-gray-600">
          Update comment information.
        </p>
      </div>

      <CommentForm
        initialValue={comment}
        onSubmit={handleSubmit}
        isSubmitting={
          updateCommentMutation.isPending
        }
      />
    </div>
  );
}