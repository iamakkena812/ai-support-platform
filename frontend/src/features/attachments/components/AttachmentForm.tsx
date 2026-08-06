/**
 * Attachment form component.
 */

import {
  useEffect,
  useState,
} from "react";

import type { Attachment } from "../types/attachment.types";

/**
 * Attachment form values.
 */
export interface AttachmentFormValues {
  /**
   * Ticket identifier.
   */
  readonly ticketId?: string;

  /**
   * Selected file.
   */
  readonly file?: File;

  /**
   * Display file name.
   */
  readonly fileName: string;
}

/**
 * Component properties.
 */
interface AttachmentFormProps {
  /**
   * Initial attachment.
   */
  readonly initialValue?: Attachment;

  /**
   * Submit handler.
   */
  readonly onSubmit: (
    values: AttachmentFormValues,
  ) => Promise<void> | void;

  /**
   * Loading state.
   */
  readonly isSubmitting?: boolean;
}

/**
 * Attachment form.
 */
export function AttachmentForm({
  initialValue,
  onSubmit,
  isSubmitting = false,
}: AttachmentFormProps): React.JSX.Element {
  const [ticketId, setTicketId] =
    useState("");

  const [fileName, setFileName] =
    useState("");

  const [file, setFile] =
    useState<File>();

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setTicketId(
      initialValue.ticketId,
    );

    setFileName(
      initialValue.originalFileName,
    );
  }, [initialValue]);

  /**
   * Handles file selection.
   *
   * @param event - Change event.
   */
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      setFile(undefined);
      return;
    }

    setFile(selectedFile);
    setFileName(
      selectedFile.name,
    );
  };

  /**
   * Handles form submission.
   *
   * @param event - Form event.
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    await onSubmit({
      ticketId: initialValue
        ? undefined
        : ticketId,
      file,
      fileName,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {!initialValue ? (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Ticket ID
          </label>

          <input
            type="text"
            required
            value={ticketId}
            onChange={(event) =>
              setTicketId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-medium">
          File
        </label>

        <input
          type="file"
          required={!initialValue}
          onChange={
            handleFileChange
          }
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          File Name
        </label>

        <input
          type="text"
          required
          value={fileName}
          onChange={(event) =>
            setFileName(
              event.target.value,
            )
          }
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {file ? (
        <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
          <p>
            <strong>
              Selected:
            </strong>{" "}
            {file.name}
          </p>

          <p>
            <strong>
              Size:
            </strong>{" "}
            {(
              file.size /
              1024
            ).toFixed(2)}{" "}
            KB
          </p>

          <p>
            <strong>
              Type:
            </strong>{" "}
            {file.type}
          </p>
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialValue
              ? "Update Attachment"
              : "Upload Attachment"}
        </button>
      </div>
    </form>
  );
}