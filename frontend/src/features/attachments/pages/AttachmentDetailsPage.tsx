/**
 * Attachment details page.
 */

import { useParams } from "react-router-dom";

import { useAttachment } from "../hooks/useAttachment";

/**
 * Formats a file size.
 *
 * @param bytes - File size in bytes.
 * @returns Human-readable file size.
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

  if (
    bytes <
    1024 * 1024 * 1024
  ) {
    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  return `${(
    bytes /
    (1024 *
      1024 *
      1024)
  ).toFixed(1)} GB`;
}

/**
 * Attachment details page.
 */
export function AttachmentDetailsPage(): React.JSX.Element {
  const {
    attachmentId = "",
  } = useParams<{
    attachmentId: string;
  }>();

  const {
    data: attachment,
    isLoading,
    isError,
    error,
  } = useAttachment(
    attachmentId,
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading attachment...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load attachment."}
      </div>
    );
  }

  if (!attachment) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Attachment not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Attachment
          Details
        </h1>

        <p className="mt-2 text-gray-600">
          View attachment
          information.
        </p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          File Information
        </h2>

        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">
              File Name
            </dt>

            <dd className="mt-1 text-gray-900">
              {
                attachment.originalFileName
              }
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              MIME Type
            </dt>

            <dd className="mt-1 text-gray-900">
              {
                attachment.contentType
              }
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              File Size
            </dt>

            <dd className="mt-1 text-gray-900">
              {formatFileSize(
                attachment.fileSize,
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Ticket
            </dt>

            <dd className="mt-1 text-gray-900">
              {attachment.ticket
                ? `${attachment.ticket.ticketNumber} — ${attachment.ticket.title}`
                : "—"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Uploaded By
            </dt>

            <dd className="mt-1 text-gray-900">
              {
                attachment
                  .uploadedBy
                  .name
              }
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Uploaded On
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(
                attachment.createdAt,
              ).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Last Updated
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(
                attachment.updatedAt,
              ).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Download URL
            </dt>

            <dd className="mt-1 break-all text-blue-600">
              {
                attachment.downloadUrl
              }
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}