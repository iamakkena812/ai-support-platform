/**
 * Attachment API client.
 *
 * Provides low-level HTTP operations for attachment resources.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  Attachment,
  AttachmentListQuery,
  AttachmentListResponse,
  AttachmentStatistics,
  CreateAttachmentRequest,
  UpdateAttachmentRequest,
} from "../types/attachment.types";

/**
 * Attachments API endpoint.
 */
const BASE_PATH = "/attachments";

/**
 * Retrieves a paginated list of attachments.
 *
 * @param query - Attachment query parameters.
 * @returns Paginated attachment response.
 */
export const getAttachments = async (
  query?: AttachmentListQuery,
): Promise<AttachmentListResponse> => {
  const { data } =
    await apiClient.get<AttachmentListResponse>(
      BASE_PATH,
      {
        params: query,
      },
    );

  return data;
};

/**
 * Retrieves an attachment by identifier.
 *
 * @param attachmentId - Attachment identifier.
 * @returns Attachment.
 */
export const getAttachment = async (
  attachmentId: string,
): Promise<Attachment> => {
  const { data } =
    await apiClient.get<Attachment>(
      `${BASE_PATH}/${attachmentId}`,
    );

  return data;
};

/**
 * Creates a new attachment.
 *
 * @param payload - Attachment creation payload.
 * @returns Created attachment.
 */
export const createAttachment = async (
  payload: CreateAttachmentRequest,
): Promise<Attachment> => {
  const formData = new FormData();

  formData.append(
    "ticketId",
    payload.ticketId,
  );

  formData.append(
    "file",
    payload.file,
  );

  const { data } =
    await apiClient.post<Attachment>(
      BASE_PATH,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      },
    );

  return data;
};

/**
 * Updates an attachment.
 *
 * @param attachmentId - Attachment identifier.
 * @param payload - Update payload.
 * @returns Updated attachment.
 */
export const updateAttachment = async (
  attachmentId: string,
  payload: UpdateAttachmentRequest,
): Promise<Attachment> => {
  const { data } =
    await apiClient.put<Attachment>(
      `${BASE_PATH}/${attachmentId}`,
      payload,
    );

  return data;
};

/**
 * Deletes an attachment.
 *
 * @param attachmentId - Attachment identifier.
 */
export const deleteAttachment = async (
  attachmentId: string,
): Promise<void> => {
  await apiClient.delete(
    `${BASE_PATH}/${attachmentId}`,
  );
};

/**
 * Downloads an attachment.
 *
 * @param attachmentId - Attachment identifier.
 * @returns Blob.
 */
export const downloadAttachment =
  async (
    attachmentId: string,
  ): Promise<Blob> => {
    const { data } =
      await apiClient.get<Blob>(
        `${BASE_PATH}/${attachmentId}/download`,
        {
          responseType: "blob",
        },
      );

    return data;
  };

/**
 * Retrieves attachment statistics.
 *
 * @returns Attachment statistics.
 */
export const getAttachmentStatistics =
  async (): Promise<AttachmentStatistics> => {
    const { data } =
      await apiClient.get<AttachmentStatistics>(
        `${BASE_PATH}/statistics`,
      );

    return data;
  };