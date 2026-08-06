/**
 * Comment API client.
 *
 * Provides low-level HTTP operations for comment resources.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  Comment,
  CommentListQuery,
  CommentListResponse,
  CommentStatistics,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types/comment.types";

/**
 * Comments API endpoint.
 */
const BASE_PATH = "/comments";

/**
 * Retrieves a paginated list of comments.
 *
 * @param query - Comment query parameters.
 * @returns Paginated comment response.
 */
export const getComments = async (
  query?: CommentListQuery,
): Promise<CommentListResponse> => {
  const { data } =
    await apiClient.get<CommentListResponse>(
      BASE_PATH,
      {
        params: query,
      },
    );

  return data;
};

/**
 * Retrieves a comment by identifier.
 *
 * @param commentId - Comment identifier.
 * @returns Comment.
 */
export const getComment = async (
  commentId: string,
): Promise<Comment> => {
  const { data } =
    await apiClient.get<Comment>(
      `${BASE_PATH}/${commentId}`,
    );

  return data;
};

/**
 * Creates a new comment.
 *
 * @param payload - Comment creation payload.
 * @returns Created comment.
 */
export const createComment = async (
  payload: CreateCommentRequest,
): Promise<Comment> => {
  const { data } =
    await apiClient.post<Comment>(
      BASE_PATH,
      payload,
    );

  return data;
};

/**
 * Updates an existing comment.
 *
 * @param commentId - Comment identifier.
 * @param payload - Comment update payload.
 * @returns Updated comment.
 */
export const updateComment = async (
  commentId: string,
  payload: UpdateCommentRequest,
): Promise<Comment> => {
  const { data } =
    await apiClient.put<Comment>(
      `${BASE_PATH}/${commentId}`,
      payload,
    );

  return data;
};

/**
 * Deletes a comment.
 *
 * @param commentId - Comment identifier.
 */
export const deleteComment = async (
  commentId: string,
): Promise<void> => {
  await apiClient.delete(
    `${BASE_PATH}/${commentId}`,
  );
};

/**
 * Retrieves comment statistics.
 *
 * @returns Comment statistics.
 */
export const getCommentStatistics =
  async (): Promise<CommentStatistics> => {
    const { data } =
      await apiClient.get<CommentStatistics>(
        `${BASE_PATH}/statistics`,
      );

    return data;
  };