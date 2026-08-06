/**
 * Comment details page.
 */

import { useParams } from "react-router-dom";

import { useComment } from "../hooks/useComment";

/**
 * Comment details page.
 */
export function CommentDetailsPage(): React.JSX.Element {
  const { commentId = "" } = useParams<{
    commentId: string;
  }>();

  const {
    data: comment,
    isLoading,
    isError,
    error,
  } = useComment(commentId);

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
      <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Comment Details
        </h1>

        <p className="mt-2 text-gray-600">
          View comment information.
        </p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          Content
        </h2>

        <p className="whitespace-pre-wrap text-gray-700">
          {comment.content}
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          Details
        </h2>

        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Author
            </dt>

            <dd className="mt-1 text-gray-900">
              {comment.author.name}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Ticket
            </dt>

            <dd className="mt-1 text-gray-900">
              {comment.ticket
                ? `${comment.ticket.ticketNumber} — ${comment.ticket.title}`
                : "—"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Visibility
            </dt>

            <dd className="mt-1 text-gray-900">
              {comment.isInternal
                ? "Internal"
                : "Public"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Created
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(
                comment.createdAt,
              ).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Updated
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(
                comment.updatedAt,
              ).toLocaleString()}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}