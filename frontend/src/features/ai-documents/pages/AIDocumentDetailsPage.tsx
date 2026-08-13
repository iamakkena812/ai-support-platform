/**
 * AI document details page.
 */

import { useParams } from "react-router-dom";

import { AIDocumentStatusBadge } from "../components/AIDocumentStatusBadge";
import { useAIDocument } from "../hooks/useAIDocument";

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
 * AI document details page.
 */
export function AIDocumentDetailsPage(): React.JSX.Element {
  const { documentId = "" } = useParams<{ documentId: string }>();

  const { data: aiDocument, isLoading, isError, error } = useAIDocument(
    documentId,
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading document...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error ? error.message : "Failed to load document."}
      </div>
    );
  }

  if (!aiDocument) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Document not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Document Details
          </h1>

          <AIDocumentStatusBadge status={aiDocument.status} />
        </div>

        <p className="mt-2 text-gray-600">
          View document metadata and processing status.
        </p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">File Information</h2>

        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">File Name</dt>

            <dd className="mt-1 text-gray-900">
              {aiDocument.originalFilename}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">MIME Type</dt>

            <dd className="mt-1 text-gray-900">{aiDocument.contentType}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">File Size</dt>

            <dd className="mt-1 text-gray-900">
              {formatFileSize(aiDocument.fileSize)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Version</dt>

            <dd className="mt-1 text-gray-900">{aiDocument.version}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Knowledge Base
            </dt>

            <dd className="mt-1 break-all text-gray-900">
              {aiDocument.knowledgeId}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Checksum</dt>

            <dd className="mt-1 break-all font-mono text-xs text-gray-900">
              {aiDocument.checksum}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Storage Location
            </dt>

            <dd className="mt-1 break-all text-gray-900">
              {aiDocument.storagePath}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Registered On
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(aiDocument.createdAt).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Last Updated
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(aiDocument.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Processing Status</h2>

        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Chunks</dt>

            <dd className="mt-1 text-gray-900">{aiDocument.chunkCount}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Embeddings</dt>

            <dd className="mt-1 text-gray-900">{aiDocument.embeddingCount}</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm text-gray-500">
          This module tracks processing status but does not itself run an
          AI chunking or embedding pipeline -- status, chunk count, and
          embedding count are updated by a separate ingestion process.
        </p>
      </section>
    </div>
  );
}
