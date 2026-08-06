/**
 * Attachment service.
 *
 * Provides the service layer between the UI and the
 * attachment API client.
 */

import {
  createAttachment,
  deleteAttachment,
  downloadAttachment,
  getAttachment,
  getAttachments,
  getAttachmentStatistics,
  updateAttachment,
} from "../api/attachment.api";

import type {
  Attachment,
  AttachmentListQuery,
  AttachmentListResponse,
  AttachmentStatistics,
  CreateAttachmentRequest,
  UpdateAttachmentRequest,
} from "../types/attachment.types";

/**
 * Attachment service.
 */
export const attachmentService = {
  /**
   * Retrieves a paginated list of attachments.
   *
   * @param query - Attachment query parameters.
   * @returns Paginated attachment response.
   */
  async getAttachments(
    query?: AttachmentListQuery,
  ): Promise<AttachmentListResponse> {
    return getAttachments(query);
  },

  /**
   * Retrieves an attachment by identifier.
   *
   * @param attachmentId - Attachment identifier.
   * @returns Attachment.
   */
  async getAttachment(
    attachmentId: string,
  ): Promise<Attachment> {
    return getAttachment(
      attachmentId,
    );
  },

  /**
   * Creates a new attachment.
   *
   * @param payload - Attachment creation payload.
   * @returns Created attachment.
   */
  async createAttachment(
    payload: CreateAttachmentRequest,
  ): Promise<Attachment> {
    return createAttachment(
      payload,
    );
  },

  /**
   * Updates an attachment.
   *
   * @param attachmentId - Attachment identifier.
   * @param payload - Update payload.
   * @returns Updated attachment.
   */
  async updateAttachment(
    attachmentId: string,
    payload: UpdateAttachmentRequest,
  ): Promise<Attachment> {
    return updateAttachment(
      attachmentId,
      payload,
    );
  },

  /**
   * Deletes an attachment.
   *
   * @param attachmentId - Attachment identifier.
   */
  async deleteAttachment(
    attachmentId: string,
  ): Promise<void> {
    return deleteAttachment(
      attachmentId,
    );
  },

  /**
   * Downloads an attachment.
   *
   * @param attachmentId - Attachment identifier.
   * @returns File blob.
   */
  async downloadAttachment(
    attachmentId: string,
  ): Promise<Blob> {
    return downloadAttachment(
      attachmentId,
    );
  },

  /**
   * Retrieves attachment statistics.
   *
   * @returns Attachment statistics.
   */
  async getAttachmentStatistics(): Promise<AttachmentStatistics> {
    return getAttachmentStatistics();
  },
};