/**
 * React Query hooks for attachment collection operations.
 *
 * Provides hooks for listing, creating, updating,
 * deleting, downloading, and retrieving attachment
 * statistics.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { attachmentQueryKeys } from "./useAttachment";
import { attachmentService } from "../services/attachment.service";

import type {
  Attachment,
  AttachmentListQuery,
  AttachmentListResponse,
  AttachmentStatistics,
  CreateAttachmentRequest,
  UpdateAttachmentRequest,
} from "../types/attachment.types";

/**
 * Statistics query key.
 */
const attachmentStatisticsQueryKey = [
  ...attachmentQueryKeys.all,
  "statistics",
] as const;

/**
 * Retrieves a paginated list of attachments.
 *
 * @param query - Attachment list query.
 * @returns React Query result.
 */
export const useAttachments = (
  query?: AttachmentListQuery,
) =>
  useQuery<AttachmentListResponse>({
    queryKey: [
      ...attachmentQueryKeys.all,
      "list",
      query,
    ] as const,

    queryFn: () =>
      attachmentService.getAttachments(
        query,
      ),
  });

/**
 * Retrieves attachment statistics.
 *
 * @returns React Query result.
 */
export const useAttachmentStatistics =
  () =>
    useQuery<AttachmentStatistics>({
      queryKey:
        attachmentStatisticsQueryKey,

      queryFn: () =>
        attachmentService.getAttachmentStatistics(),
    });

/**
 * Creates an attachment.
 *
 * @returns Mutation.
 */
export const useCreateAttachment =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation<
      Attachment,
      Error,
      CreateAttachmentRequest
    >({
      mutationFn: (
        payload,
      ) =>
        attachmentService.createAttachment(
          payload,
        ),

      onSuccess: async () => {
        await queryClient.invalidateQueries(
          {
            queryKey:
              attachmentQueryKeys.all,
          },
        );
      },
    });
  };

/**
 * Update attachment variables.
 */
interface UpdateAttachmentVariables {
  /**
   * Attachment identifier.
   */
  readonly attachmentId: string;

  /**
   * Update payload.
   */
  readonly payload: UpdateAttachmentRequest;
}

/**
 * Updates an attachment.
 *
 * @returns Mutation.
 */
export const useUpdateAttachment =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation<
      Attachment,
      Error,
      UpdateAttachmentVariables
    >({
      mutationFn: ({
        attachmentId,
        payload,
      }) =>
        attachmentService.updateAttachment(
          attachmentId,
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
                attachmentQueryKeys.all,
            },
          ),

          queryClient.invalidateQueries(
            {
              queryKey:
                attachmentQueryKeys.detail(
                  variables.attachmentId,
                ),
            },
          ),
        ]);
      },
    });
  };

/**
 * Deletes an attachment.
 *
 * @returns Mutation.
 */
export const useDeleteAttachment =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation<
      void,
      Error,
      string
    >({
      mutationFn: (
        attachmentId,
      ) =>
        attachmentService.deleteAttachment(
          attachmentId,
        ),

      onSuccess: async () => {
        await queryClient.invalidateQueries(
          {
            queryKey:
              attachmentQueryKeys.all,
          },
        );
      },
    });
  };

/**
 * Downloads an attachment.
 *
 * @returns Mutation.
 */
export const useDownloadAttachment =
  () =>
    useMutation<
      Blob,
      Error,
      string
    >({
      mutationFn: (
        attachmentId,
      ) =>
        attachmentService.downloadAttachment(
          attachmentId,
        ),
    });