/**
 * Attachments page.
 */

import {
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { AttachmentFilters } from "../components/AttachmentFilters";
import { AttachmentList } from "../components/AttachmentList";
import { DeleteAttachmentDialog } from "../components/DeleteAttachmentDialog";
import {
  useAttachments,
  useDeleteAttachment,
  useDownloadAttachment,
} from "../hooks/useAttachments";

import type {
  Attachment,
  AttachmentFilterValues,
} from "../types/attachment.types";

/**
 * Attachments page.
 *
 * Displays the attachment list with filtering
 * and download capabilities.
 *
 * @returns Attachments page component.
 */
export function AttachmentsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [filters, setFilters] =
    useState<AttachmentFilterValues>({});

  const [attachmentToDelete, setAttachmentToDelete] =
    useState<Attachment | null>(null);

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
  } = useAttachments(query);

  const downloadAttachmentMutation =
    useDownloadAttachment();

  const deleteAttachmentMutation =
    useDeleteAttachment();

  /**
   * Handles viewing an attachment.
   *
   * @param attachment - Selected attachment.
   */
  const handleView = (
    attachment: Attachment,
  ): void => {
    navigate(`/attachments/${attachment.id}`);
  };

  /**
   * Handles editing an attachment.
   *
   * @param attachment - Selected attachment.
   */
  const handleEdit = (
    attachment: Attachment,
  ): void => {
    navigate(`/attachments/${attachment.id}/edit`);
  };

  /**
   * Handles deleting an attachment.
   *
   * @param attachment - Selected attachment.
   */
  const handleDelete = (
    attachment: Attachment,
  ): void => {
    setAttachmentToDelete(attachment);
  };

  /**
   * Confirms deletion of the selected attachment.
   *
   * @param attachment - Attachment to delete.
   */
  const handleConfirmDelete = async (
    attachment: Attachment,
  ): Promise<void> => {
    await deleteAttachmentMutation.mutateAsync(attachment.id);
    setAttachmentToDelete(null);
  };

  /**
   * Handles downloading an attachment.
   *
   * @param attachment - Selected attachment.
   */
  const handleDownload = async (
    attachment: Attachment,
  ): Promise<void> => {
    try {
      const blob =
        await downloadAttachmentMutation.mutateAsync(
          attachment.id,
        );

      const downloadUrl =
        URL.createObjectURL(
          blob,
        );

      const anchor =
        document.createElement(
          "a",
        );

      anchor.href =
        downloadUrl;

      anchor.download =
        attachment.originalFileName;

      document.body.appendChild(
        anchor,
      );

      anchor.click();

      document.body.removeChild(
        anchor,
      );

      URL.revokeObjectURL(
        downloadUrl,
      );
    } catch (downloadError) {
      console.error(
        "Failed to download attachment.",
        downloadError,
      );
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attachments
          </h1>

          <p className="mt-1 text-gray-600">
            View and manage ticket
            attachments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/attachments/create")}
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Upload Attachment
        </button>
      </header>

      <AttachmentFilters
        initialValue={filters}
        onChange={setFilters}
      />

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading attachments...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error instanceof Error
            ? error.message
            : "Failed to load attachments."}
        </div>
      ) : null}

      {!isLoading &&
      !isError ? (
        <AttachmentList
          attachments={
            data?.items ?? []
          }
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={
            handleDownload
          }
        />
      ) : null}

      {attachmentToDelete ? (
        <DeleteAttachmentDialog
          attachment={attachmentToDelete}
          isOpen
          isDeleting={deleteAttachmentMutation.isPending}
          onClose={() => setAttachmentToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </div>
  );
}
