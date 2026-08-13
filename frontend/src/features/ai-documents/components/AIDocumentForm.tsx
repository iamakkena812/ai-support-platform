/**
 * AI document registration form.
 *
 * The backend AI Documents endpoint registers document *metadata* --
 * it has no file-upload endpoint or storage backend of its own (see
 * `DocumentCreateRequest` in `app/ai/documents/schemas.py`). This form
 * lets the user pick a real local file so the filename, content type,
 * file size, and checksum are all derived from real bytes (the
 * checksum is a genuine SHA-256 digest computed in-browser via the
 * Web Crypto API, not a placeholder), while the storage location is
 * entered manually since no storage integration is configured --
 * see the "Configuration required" note in the Phase 15 report.
 */

import {
  useState,
} from "react";

import { SUPPORTED_DOCUMENT_TYPES } from "../types/aiDocument.types";

import type { AIKnowledgeBaseOption } from "../types/aiDocument.types";

/**
 * AI document form values.
 */
export interface AIDocumentFormValues {
  readonly knowledgeId: string;
  readonly filename: string;
  readonly originalFilename: string;
  readonly contentType: string;
  readonly fileSize: number;
  readonly storagePath: string;
  readonly checksum: string;
}

/**
 * Component properties.
 */
interface AIDocumentFormProps {
  /**
   * Knowledge bases the document may be registered under.
   */
  readonly knowledgeBaseOptions: readonly AIKnowledgeBaseOption[];

  /**
   * Submit handler.
   */
  readonly onSubmit: (values: AIDocumentFormValues) => Promise<void> | void;

  /**
   * Loading state.
   */
  readonly isSubmitting?: boolean;
}

/**
 * Computes a SHA-256 checksum for a file using the Web Crypto API.
 *
 * @param file - Selected file.
 * @returns Hex-encoded checksum.
 */
async function computeChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * AI document registration form.
 */
export function AIDocumentForm({
  knowledgeBaseOptions,
  onSubmit,
  isSubmitting = false,
}: AIDocumentFormProps): React.JSX.Element {
  const [knowledgeId, setKnowledgeId] = useState(
    knowledgeBaseOptions[0]?.id ?? "",
  );

  const [file, setFile] = useState<File>();
  const [filename, setFilename] = useState("");
  const [checksum, setChecksum] = useState("");
  const [storagePath, setStoragePath] = useState("");
  const [isHashing, setIsHashing] = useState(false);

  /**
   * Handles file selection: derives filename/type/size from the real
   * file and computes a real checksum from its bytes.
   *
   * @param event - Change event.
   */
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(undefined);
      return;
    }

    setFile(selectedFile);
    setFilename(selectedFile.name);
    setStoragePath((current) =>
      current.trim().length > 0 ? current : `documents/${selectedFile.name}`,
    );

    setIsHashing(true);

    try {
      const digest = await computeChecksum(selectedFile);
      setChecksum(digest);
    } finally {
      setIsHashing(false);
    }
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

    if (!file || !knowledgeId) {
      return;
    }

    await onSubmit({
      knowledgeId,
      filename,
      originalFilename: file.name,
      contentType: file.type || "application/octet-stream",
      fileSize: file.size,
      storagePath,
      checksum,
    });
  };

  const canSubmit =
    Boolean(file) &&
    Boolean(knowledgeId) &&
    Boolean(checksum) &&
    storagePath.trim().length > 0 &&
    !isHashing;

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Knowledge Base
        </label>

        {knowledgeBaseOptions.length === 0 ? (
          <p className="rounded border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
            No knowledge bases exist in your organization yet. A document
            must belong to a knowledge base.
          </p>
        ) : (
          <select
            required
            value={knowledgeId}
            onChange={(event) => setKnowledgeId(event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            {knowledgeBaseOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">File</label>

        <input
          type="file"
          required
          accept={SUPPORTED_DOCUMENT_TYPES.join(",")}
          onChange={(event) => {
            void handleFileChange(event);
          }}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Display Name
        </label>

        <input
          type="text"
          required
          value={filename}
          onChange={(event) => setFilename(event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Storage Location
        </label>

        <input
          type="text"
          required
          value={storagePath}
          onChange={(event) => setStoragePath(event.target.value)}
          placeholder="e.g. s3://org-documents/document.pdf"
          className="w-full rounded border border-gray-300 px-3 py-2"
        />

        <p className="mt-1 text-xs text-gray-500">
          This module registers document metadata only -- it does not
          upload or store the file itself. Enter the location where this
          file has already been stored.
        </p>
      </div>

      {file ? (
        <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
          <p>
            <strong>Selected:</strong> {file.name}
          </p>

          <p>
            <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>

          <p>
            <strong>Type:</strong> {file.type || "application/octet-stream"}
          </p>

          <p className="break-all">
            <strong>SHA-256:</strong>{" "}
            {isHashing ? "Computing..." : checksum}
          </p>
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Registering..." : "Register Document"}
        </button>
      </div>
    </form>
  );
}
