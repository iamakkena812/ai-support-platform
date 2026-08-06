/**
 * Attachment list component.
 *
 * Displays a collection of attachments.
 */

import type { FC } from "react";

import { AttachmentCard } from "./AttachmentCard";

import type { Attachment } from "../types/attachment.types";

/**
 * Component properties.
 */
export interface AttachmentListProps {
  /**
   * Collection of attachments.
   */
  readonly attachments: readonly Attachment[];

  /**
   * Invoked when an attachment is selected.
   */
  readonly onView?: (
    attachment: Attachment,
  ) => void;

  /**
   * Invoked when editing an attachment.
   */
  readonly onEdit?: (
    attachment: Attachment,
  ) => void;

  /**
   * Invoked when deleting an attachment.
   */
  readonly onDelete?: (
    attachment: Attachment,
  ) => void;

  /**
   * Invoked when downloading an attachment.
   */
  readonly onDownload?: (
    attachment: Attachment,
  ) => void;
}

/**
 * Attachment list.
 *
 * @param props - Component properties.
 * @returns Attachment list component.
 */
export const AttachmentList: FC<
  AttachmentListProps
> = ({
  attachments,
  onView,
  onEdit,
  onDelete,
  onDownload,
}) => {
  if (
    attachments.length === 0
  ) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        No attachments found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {attachments.map(
        (attachment) => (
          <div
            key={
              attachment.id
            }
            className="rounded-lg border border-transparent transition-colors hover:border-gray-200"
          >
            <AttachmentCard
              attachment={
                attachment
              }
              onClick={
                onView
              }
              onDownload={
                onDownload
              }
            />

            <div className="flex justify-end gap-2 rounded-b-lg border-x border-b border-gray-200 bg-gray-50 px-4 py-3">
              <button
                type="button"
                onClick={() =>
                  onView?.(
                    attachment,
                  )
                }
                className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100"
              >
                View
              </button>

              <button
                type="button"
                onClick={() =>
                  onEdit?.(
                    attachment,
                  )
                }
                className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  onDownload?.(
                    attachment,
                  )
                }
                className="rounded border border-green-300 px-3 py-1 text-sm text-green-700 transition-colors hover:bg-green-50"
              >
                Download
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete?.(
                    attachment,
                  )
                }
                className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );
};