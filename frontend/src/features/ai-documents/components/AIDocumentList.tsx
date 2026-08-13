/**
 * AI document list component.
 *
 * Displays a collection of AI documents in a table.
 */

import type { FC } from "react";

import { AIDocumentStatusBadge } from "./AIDocumentStatusBadge";

import type { AIDocument } from "../types/aiDocument.types";

/**
 * Formats a file size.
 *
 * @param bytes - File size in bytes.
 * @returns Human-readable file size.
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Component properties.
 */
export interface AIDocumentListProps {
  /**
   * Collection of documents.
   */
  readonly documents: readonly AIDocument[];

  /**
   * Invoked when a document is selected.
   */
  readonly onView?: (document: AIDocument) => void;

  /**
   * Invoked when deleting a document.
   */
  readonly onDelete?: (document: AIDocument) => void;
}

/**
 * AI document list.
 *
 * @param props - Component properties.
 * @returns AI document list component.
 */
export const AIDocumentList: FC<AIDocumentListProps> = ({
  documents,
  onView,
  onDelete,
}) => {
  if (documents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        No documents found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              File
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Type
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Size
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Chunks / Embeddings
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Registered
            </th>

            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {documents.map((aiDocument) => (
            <tr
              key={aiDocument.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onView?.(aiDocument)}
            >
              <td className="max-w-xs truncate px-4 py-3 text-sm font-medium text-gray-900">
                {aiDocument.originalFilename}
              </td>

              <td className="px-4 py-3 text-sm text-gray-600">
                {aiDocument.contentType}
              </td>

              <td className="px-4 py-3 text-sm text-gray-600">
                {formatFileSize(aiDocument.fileSize)}
              </td>

              <td className="px-4 py-3">
                <AIDocumentStatusBadge status={aiDocument.status} />
              </td>

              <td className="px-4 py-3 text-sm text-gray-600">
                {aiDocument.chunkCount} / {aiDocument.embeddingCount}
              </td>

              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(aiDocument.createdAt).toLocaleDateString()}
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete?.(aiDocument);
                  }}
                  className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
