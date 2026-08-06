/**
 * Comments page.
 */

import {
  useMemo,
  useState,
} from "react";

import { CommentList } from "../components/CommentList";
import { CommentFilters } from "../components/CommentFilters";
import { useComments } from "../hooks/useComments";

import type {
  Comment,
  CommentFilterValues,
} from "../types/comment.types";

/**
 * Comments page.
 */
export function CommentsPage(): React.JSX.Element {
  const [filters, setFilters] =
    useState<CommentFilterValues>({});

  const query = useMemo(
    () => ({
      page: 1,
      pageSize: 10,
      filters,
    }),
    [filters],
  );

  const {
    data,
    isLoading,
    isError,
    error,
  } = useComments(query);

  /**
   * Handles viewing a comment.
   *
   * @param comment - Selected comment.
   */
  const handleView = (
    comment: Comment,
  ): void => {
    console.info(
      "View comment",
      comment.id,
    );
  };

  /**
   * Handles editing a comment.
   *
   * @param comment - Selected comment.
   */
  const handleEdit = (
    comment: Comment,
  ): void => {
    console.info(
      "Edit comment",
      comment.id,
    );
  };

  /**
   * Handles deleting a comment.
   *
   * @param comment - Selected comment.
   */
  const handleDelete = (
    comment: Comment,
  ): void => {
    console.info(
      "Delete comment",
      comment.id,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Comments
          </h1>

          <p className="mt-1 text-gray-600">
            View and manage ticket
            comments.
          </p>
        </div>

        <button
          type="button"
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Create Comment
        </button>
      </div>

      <CommentFilters
        initialValue={filters}
        onChange={setFilters}
      />

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading comments...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error instanceof Error
            ? error.message
            : "Failed to load comments."}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <CommentList
          comments={
            data?.items ?? []
          }
          onView={handleView}
          onEdit={handleEdit}
          onDelete={
            handleDelete
          }
        />
      ) : null}
    </div>
  );
}