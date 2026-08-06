/**
 * React Query hook for retrieving a single comment.
 *
 * Provides cached access to an individual comment.
 */

import { useQuery } from "@tanstack/react-query";

import { commentService } from "../services/comment.service";

import type { Comment } from "../types/comment.types";

/**
 * Query key factory for comment queries.
 */
export const commentQueryKeys = {
  /**
   * Root query key.
   */
  all: ["comments"] as const,

  /**
   * Detail query key.
   *
   * @param commentId - Comment identifier.
   * @returns Query key.
   */
  detail: (commentId: string) =>
    [...commentQueryKeys.all, "detail", commentId] as const,
};

/**
 * Retrieves a single comment.
 *
 * @param commentId - Comment identifier.
 * @returns React Query result.
 */
export const useComment = (
  commentId: string,
) =>
  useQuery<Comment>({
    queryKey:
      commentQueryKeys.detail(
        commentId,
      ),

    queryFn: () =>
      commentService.getComment(
        commentId,
      ),

    enabled:
      commentId.trim().length > 0,
  });