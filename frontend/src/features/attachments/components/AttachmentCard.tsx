/**
 * Attachment card component.
 *
 * Displays a single attachment in a reusable card layout.
 */

import type { FC } from "react";

import type { Attachment } from "../types/attachment.types";

/**
 * Component properties.
 */
export interface AttachmentCardProps {
  /**
   * Attachment to display.
   */
  readonly attachment: Attachment;

  /**
   * Invoked when the attachment is selected.
   */
  readonly onClick?: (
    attachment: Attachment,
  ) => void;

  /**
   * Invoked when the download action is selected.
   */
  readonly onDownload?: (
    attachment: Attachment,
  ) => void;
}

/**
 * Formats a file size.
 *
 * @param bytes - File size in bytes.
 * @returns Human-readable size.
 */
function formatFileSize(
  bytes: number,
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`;
}

/**
 * Attachment card.
 *
 * @param props - Component properties.
 * @returns Attachment card component.
 */
export const AttachmentCard: FC<
  AttachmentCardProps
> = ({
  attachment,
  onClick,
  onDownload,
}) => (
  <div
    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    role={
      onClick
        ? "button"
        : undefined
    }
    tabIndex={
      onClick
        ? 0
        : undefined
    }
    onClick={() =>
      onClick?.(
        attachment,
      )
    }
    onKeyDown={(
      event,
    ) => {
      if (
        onClick &&
        (event.key ===
          "Enter" ||
          event.key === " ")
      ) {
        event.preventDefault();

        onClick(
          attachment,
        );
      }
    }}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {
            attachment.originalFileName
          }
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          Uploaded by{" "}
          {
            attachment
              .uploadedBy
              .name
          }
        </p>
      </div>

      <button
        type="button"
        onClick={(
          event,
        ) => {
          event.stopPropagation();

          onDownload?.(
            attachment,
          );
        }}
        className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-50"
      >
        Download
      </button>
    </div>

    <div className="mt-4 grid gap-2 text-sm text-gray-600">
      <div className="flex justify-between">
        <span>
          File Type
        </span>

        <span className="font-medium">
          {
            attachment.contentType
          }
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Size
        </span>

        <span className="font-medium">
          {formatFileSize(
            attachment.fileSize,
          )}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Ticket
        </span>

        <span className="font-medium">
          {attachment.ticket
            ? attachment
                .ticket
                .ticketNumber
            : "—"}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Uploaded
        </span>

        <span className="font-medium">
          {new Date(
            attachment.createdAt,
          ).toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>
);