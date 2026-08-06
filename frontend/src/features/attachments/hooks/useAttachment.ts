/**
 * React Query hook for retrieving a single attachment.
 *
 * Provides cached access to an individual attachment.
 */

import { useQuery } from "@tanstack/react-query";

import { attachmentService } from "../services/attachment.service";

import type { Attachment } from "../types/attachment.types";

/**
 * Query key factory for attachment queries.
 */
export const attachmentQueryKeys = {
  /**
   * Root query key.
   */
  all: ["attachments"] as const,

  /**
   * Detail query key.
   *
   * @param attachmentId - Attachment identifier.
   * @returns Query key.
   */
  detail: (
    attachmentId: string,
  ) =>
    [
      ...attachmentQueryKeys.all,
      "detail",
      attachmentId,
    ] as const,
};

/**
 * Retrieves a single attachment.
 *
 * @param attachmentId - Attachment identifier.
 * @returns React Query result.
 */
export const useAttachment = (
  attachmentId: string,
) =>
  useQuery<Attachment>({
    queryKey:
      attachmentQueryKeys.detail(
        attachmentId,
      ),

    queryFn: () =>
      attachmentService.getAttachment(
        attachmentId,
      ),

    enabled:
      attachmentId.trim().length >
      0,
  });