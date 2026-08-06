/**
 * Attachment filters component.
 */

import {
  useEffect,
  useState,
} from "react";

import type { AttachmentFilterValues } from "../types/attachment.types";

/**
 * Component properties.
 */
export interface AttachmentFiltersProps {
  /**
   * Initial filter values.
   */
  readonly initialValue?: AttachmentFilterValues;

  /**
   * Invoked when filters change.
   */
  readonly onChange: (
    filters: AttachmentFilterValues,
  ) => void;
}

/**
 * Attachment filters.
 */
export function AttachmentFilters({
  initialValue,
  onChange,
}: AttachmentFiltersProps): React.JSX.Element {
  const [search, setSearch] =
    useState("");

  const [ticketId, setTicketId] =
    useState("");

  const [contentType, setContentType] =
    useState("");

  const [uploadedBy, setUploadedBy] =
    useState("");

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setSearch(
      initialValue.search ?? "",
    );

    setTicketId(
      initialValue.ticketId ?? "",
    );

    setContentType(
      initialValue.contentType ??
        "",
    );

    setUploadedBy(
      initialValue.uploadedBy ??
        "",
    );
  }, [initialValue]);

  useEffect(() => {
    onChange({
      search:
        search.trim() === ""
          ? undefined
          : search,

      ticketId:
        ticketId.trim() === ""
          ? undefined
          : ticketId,

      contentType:
        contentType.trim() === ""
          ? undefined
          : contentType,

      uploadedBy:
        uploadedBy.trim() === ""
          ? undefined
          : uploadedBy,
    });
  }, [
    search,
    ticketId,
    contentType,
    uploadedBy,
    onChange,
  ]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Search
          </label>

          <input
            type="text"
            placeholder="Search attachments..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Ticket ID
          </label>

          <input
            type="text"
            placeholder="Ticket ID"
            value={ticketId}
            onChange={(event) =>
              setTicketId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Content Type
          </label>

          <input
            type="text"
            placeholder="image/png"
            value={contentType}
            onChange={(event) =>
              setContentType(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Uploaded By
          </label>

          <input
            type="text"
            placeholder="User ID"
            value={uploadedBy}
            onChange={(event) =>
              setUploadedBy(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}