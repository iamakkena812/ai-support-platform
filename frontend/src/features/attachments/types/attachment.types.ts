/**
 * Attachment domain types.
 *
 * Defines the TypeScript models used throughout the
 * Attachments feature.
 */

/**
 * Attachment uploader.
 */
export interface AttachmentUploader {
  /**
   * User identifier.
   */
  readonly id: string;

  /**
   * User display name.
   */
  readonly name: string;

  /**
   * User email.
   */
  readonly email?: string | null;

  /**
   * User avatar URL.
   */
  readonly avatarUrl?: string | null;
}

/**
 * Ticket reference.
 */
export interface AttachmentTicket {
  /**
   * Ticket identifier.
   */
  readonly id: string;

  /**
   * Ticket number.
   */
  readonly ticketNumber: string;

  /**
   * Ticket title.
   */
  readonly title: string;
}

/**
 * Attachment entity.
 */
export interface Attachment {
  /**
   * Attachment identifier.
   */
  readonly id: string;

  /**
   * Ticket identifier.
   */
  readonly ticketId: string;

  /**
   * File name.
   */
  readonly fileName: string;

  /**
   * Original file name.
   */
  readonly originalFileName: string;

  /**
   * MIME type.
   */
  readonly contentType: string;

  /**
   * File size in bytes.
   */
  readonly fileSize: number;

  /**
   * Download URL.
   */
  readonly downloadUrl: string;

  /**
   * File checksum.
   */
  readonly checksum?: string | null;

  /**
   * User who uploaded the attachment.
   */
  readonly uploadedBy: AttachmentUploader;

  /**
   * Associated ticket.
   */
  readonly ticket?: AttachmentTicket | null;

  /**
   * Upload timestamp.
   */
  readonly createdAt: string;

  /**
   * Last update timestamp.
   */
  readonly updatedAt: string;
}

/**
 * Create attachment request.
 */
export interface CreateAttachmentRequest {
  /**
   * Ticket identifier.
   */
  readonly ticketId: string;

  /**
   * File to upload.
   */
  readonly file: File;
}

/**
 * Update attachment request.
 */
export interface UpdateAttachmentRequest {
  /**
   * Updated file name.
   */
  readonly fileName?: string;
}

/**
 * Attachment filter values.
 */
export interface AttachmentFilterValues {
  /**
   * Search text.
   */
  readonly search?: string;

  /**
   * Ticket identifier.
   */
  readonly ticketId?: string;

  /**
   * Content type.
   */
  readonly contentType?: string;

  /**
   * Uploaded by.
   */
  readonly uploadedBy?: string;
}

/**
 * Sort direction.
 */
export type SortDirection =
  | "asc"
  | "desc";

/**
 * Attachment sorting.
 */
export interface AttachmentSort {
  /**
   * Sort field.
   */
  readonly field: keyof Attachment;

  /**
   * Sort direction.
   */
  readonly direction: SortDirection;
}

/**
 * Attachment list query.
 */
export interface AttachmentListQuery {
  /**
   * Page number.
   */
  readonly page?: number;

  /**
   * Page size.
   */
  readonly pageSize?: number;

  /**
   * Filter values.
   */
  readonly filters?: AttachmentFilterValues;

  /**
   * Sort definition.
   */
  readonly sort?: AttachmentSort;
}

/**
 * Paginated attachment response.
 */
export interface AttachmentListResponse {
  /**
   * Returned attachments.
   */
  readonly items: readonly Attachment[];

  /**
   * Total number of records.
   */
  readonly total: number;

  /**
   * Current page.
   */
  readonly page: number;

  /**
   * Page size.
   */
  readonly pageSize: number;

  /**
   * Total pages.
   */
  readonly totalPages: number;
}

/**
 * Attachment statistics.
 */
export interface AttachmentStatistics {
  /**
   * Total attachments.
   */
  readonly total: number;

  /**
   * Total storage used in bytes.
   */
  readonly totalStorage: number;

  /**
   * Average file size in bytes.
   */
  readonly averageFileSize: number;
}