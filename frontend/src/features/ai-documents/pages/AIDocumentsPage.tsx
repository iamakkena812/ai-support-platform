/**
 * AI Documents page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AIDocumentList } from "../components/AIDocumentList";
import { DeleteAIDocumentDialog } from "../components/DeleteAIDocumentDialog";
import {
  useAIDocuments,
  useDeleteAIDocument,
} from "../hooks/useAIDocuments";

import type { AIDocument } from "../types/aiDocument.types";

/**
 * AI Documents page.
 *
 * Displays the document list registered against the caller's
 * organization's knowledge bases.
 *
 * @returns AI Documents page component.
 */
export function AIDocumentsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [documentToDelete, setDocumentToDelete] = useState<AIDocument | null>(
    null,
  );

  const { data, isLoading, isError, error } = useAIDocuments({
    page: 1,
    pageSize: 20,
  });

  const deleteDocumentMutation = useDeleteAIDocument();

  /**
   * Handles viewing a document.
   *
   * @param document - Selected document.
   */
  const handleView = (document: AIDocument): void => {
    navigate(`/ai/documents/${document.id}`);
  };

  /**
   * Handles deleting a document.
   *
   * @param document - Selected document.
   */
  const handleDelete = (document: AIDocument): void => {
    setDocumentToDelete(document);
  };

  /**
   * Confirms deletion of the selected document.
   *
   * @param document - Document to delete.
   */
  const handleConfirmDelete = async (document: AIDocument): Promise<void> => {
    await deleteDocumentMutation.mutateAsync(document.id);
    setDocumentToDelete(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Documents</h1>

          <p className="mt-1 text-gray-600">
            Documents registered against your organization&apos;s AI
            knowledge bases.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/ai/documents/create")}
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Register Document
        </button>
      </header>

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading documents...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error instanceof Error ? error.message : "Failed to load documents."}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <AIDocumentList
          documents={data?.documents ?? []}
          onView={handleView}
          onDelete={handleDelete}
        />
      ) : null}

      {documentToDelete ? (
        <DeleteAIDocumentDialog
          document={documentToDelete}
          isOpen
          isDeleting={deleteDocumentMutation.isPending}
          onClose={() => setDocumentToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </div>
  );
}
