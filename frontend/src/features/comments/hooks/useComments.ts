/**
 * React Query hooks for comment collection operations.
 *
 * Provides hooks for listing, creating, updating,
 * deleting, and retrieving comment statistics.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { commentQueryKeys } from "./useComment";
import { commentService } from "../services/comment.service";

import type {
  Comment,
  CommentListQuery,
  CommentListResponse,
  CommentStatistics,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types/comment.types";

/**
 * Statistics query key.
 */
const commentStatisticsQueryKey = [
  ...commentQueryKeys.all,
  "statistics",
] as const;

/**
 * Retrieves a paginated list of comments.
 *
 * @param query - Comment list query.
 * @returns React Query result.
 */
export const useComments = (
  query?: CommentListQuery,
) =>
  useQuery<CommentListResponse>({
    queryKey: [
      ...commentQueryKeys.all,
      "list",
      query,
    ] as const,

    queryFn: () =>
      commentService.getComments(query),
  });

/**
 * Retrieves comment statistics.
 *
 * @returns React Query result.
 */
export const useCommentStatistics =
  () =>
    useQuery<CommentStatistics>({
      queryKey:
        commentStatisticsQueryKey,

      queryFn: () =>
        commentService.getCommentStatistics(),
    });

/**
 * Creates a comment.
 *
 * @returns Mutation.
 */
export const useCreateComment =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation<
      Comment,
      Error,
      CreateCommentRequest
    >({
      mutationFn: (
        payload,
      ) =>
        commentService.createComment(
          payload,
        ),

      onSuccess: async () => {
        await queryClient.invalidateQueries(
          {
            queryKey:
              commentQueryKeys.all,
          },
        );
      },
    });
  };

/**
 * Update comment variables.
 */
interface UpdateCommentVariables {
  /**
   * Comment identifier.
   */
  readonly commentId: string;

  /**
   * Update payload.
   */
  readonly payload: UpdateCommentRequest;
}

/**
 * Updates a comment.
 *
 * @returns Mutation.
 */
export const useUpdateComment =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation<
      Comment,
      Error,
      UpdateCommentVariables
    >({
      mutationFn: ({
        commentId,
        payload,
      }) =>
        commentService.updateComment(
          commentId,
          payload,
        ),

      onSuccess: async (
        _,
        variables,
      ) => {
        await Promise.all([
          queryClient.invalidateQueries(
            {
              queryKey:
                commentQueryKeys.all,
            },
          ),

          queryClient.invalidateQueries(
            {
              queryKey:
                commentQueryKeys.detail(
                  variables.commentId,
                ),
            },
          ),
        ]);
      },
    });
  };

/**
 * Deletes a comment.
 *
 * @returns Mutation.
 */
export const useDeleteComment =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation<
      void,
      Error,
      string
    >({
      mutationFn: (
        commentId,
      ) =>
        commentService.deleteComment(
          commentId,
        ),

      onSuccess: async () => {
        await queryClient.invalidateQueries(
          {
            queryKey:
              commentQueryKeys.all,
          },
        );
      },
    });
  };