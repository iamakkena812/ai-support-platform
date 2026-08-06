/**
 * Comment service.
 *
 * Provides the service layer between the UI and the
 * comment API client.
 */

import {
  createComment,
  deleteComment,
  getComment,
  getComments,
  getCommentStatistics,
  updateComment,
} from "../api/comment.api";

import type {
  Comment,
  CommentListQuery,
  CommentListResponse,
  CommentStatistics,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types/comment.types";

/**
 * Comment service.
 */
export const commentService = {
  /**
   * Retrieves all comments.
   *
   * @param query - Comment query parameters.
   * @returns Paginated comment response.
   */
  async getComments(
    query?: CommentListQuery,
  ): Promise<CommentListResponse> {
    return getComments(query);
  },

  /**
   * Retrieves a comment.
   *
   * @param commentId - Comment identifier.
   * @returns Comment.
   */
  async getComment(
    commentId: string,
  ): Promise<Comment> {
    return getComment(commentId);
  },

  /**
   * Creates a comment.
   *
   * @param payload - Comment creation payload.
   * @returns Created comment.
   */
  async createComment(
    payload: CreateCommentRequest,
  ): Promise<Comment> {
    return createComment(payload);
  },

  /**
   * Updates a comment.
   *
   * @param commentId - Comment identifier.
   * @param payload - Comment update payload.
   * @returns Updated comment.
   */
  async updateComment(
    commentId: string,
    payload: UpdateCommentRequest,
  ): Promise<Comment> {
    return updateComment(
      commentId,
      payload,
    );
  },

  /**
   * Deletes a comment.
   *
   * @param commentId - Comment identifier.
   */
  async deleteComment(
    commentId: string,
  ): Promise<void> {
    return deleteComment(commentId);
  },

  /**
   * Retrieves comment statistics.
   *
   * @returns Comment statistics.
   */
  async getCommentStatistics(): Promise<CommentStatistics> {
    return getCommentStatistics();
  },
};