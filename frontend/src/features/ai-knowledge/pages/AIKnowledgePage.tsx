/**
 * AI Knowledge page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AIKnowledgeList } from "../components/AIKnowledgeList";
import { DeleteAIKnowledgeDialog } from "../components/DeleteAIKnowledgeDialog";
import {
  useAIKnowledgeBases,
  useDeleteAIKnowledgeBase,
} from "../hooks/useAIKnowledgeBases";

import { useAuth } from "../../../app/providers/auth/useAuth";

import type { AIKnowledgeBase } from "../types/aiKnowledge.types";

/**
 * AI Knowledge page.
 *
 * Displays the knowledge bases visible to the caller (their own
 * private ones plus any organization-wide ones).
 *
 * @returns AI Knowledge page component.
 */
export function AIKnowledgePage(): React.JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [knowledgeBaseToDelete, setKnowledgeBaseToDelete] =
    useState<AIKnowledgeBase | null>(null);

  const { data, isLoading, isError, error } = useAIKnowledgeBases({
    offset: 0,
    limit: 20,
  });

  const deleteKnowledgeBaseMutation = useDeleteAIKnowledgeBase();

  /**
   * Handles viewing a knowledge base.
   *
   * @param knowledgeBase - Selected knowledge base.
   */
  const handleView = (knowledgeBase: AIKnowledgeBase): void => {
    navigate(`/ai/knowledge/${knowledgeBase.id}`);
  };

  /**
   * Handles editing a knowledge base.
   *
   * @param knowledgeBase - Selected knowledge base.
   */
  const handleEdit = (knowledgeBase: AIKnowledgeBase): void => {
    navigate(`/ai/knowledge/${knowledgeBase.id}/edit`);
  };

  /**
   * Handles deleting a knowledge base.
   *
   * @param knowledgeBase - Selected knowledge base.
   */
  const handleDelete = (knowledgeBase: AIKnowledgeBase): void => {
    setKnowledgeBaseToDelete(knowledgeBase);
  };

  /**
   * Confirms deletion of the selected knowledge base.
   *
   * @param knowledgeBase - Knowledge base to delete.
   */
  const handleConfirmDelete = async (
    knowledgeBase: AIKnowledgeBase,
  ): Promise<void> => {
    await deleteKnowledgeBaseMutation.mutateAsync(knowledgeBase.id);
    setKnowledgeBaseToDelete(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Knowledge</h1>

          <p className="mt-1 text-gray-600">
            Knowledge bases your AI documents are organized under.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/ai/knowledge/create")}
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Create Knowledge Base
        </button>
      </header>

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading knowledge bases...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error instanceof Error
            ? error.message
            : "Failed to load knowledge bases."}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <AIKnowledgeList
          knowledgeBases={data?.items ?? []}
          currentUserId={user?.id ?? ""}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : null}

      {knowledgeBaseToDelete ? (
        <DeleteAIKnowledgeDialog
          knowledgeBase={knowledgeBaseToDelete}
          isOpen
          isDeleting={deleteKnowledgeBaseMutation.isPending}
          onClose={() => setKnowledgeBaseToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </div>
  );
}
