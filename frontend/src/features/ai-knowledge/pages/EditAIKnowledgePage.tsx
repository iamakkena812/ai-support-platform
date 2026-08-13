/**
 * Edit AI knowledge base page.
 */

import { useNavigate, useParams } from "react-router-dom";

import { AIKnowledgeForm } from "../components/AIKnowledgeForm";
import { useAIKnowledgeBase } from "../hooks/useAIKnowledgeBase";
import { useUpdateAIKnowledgeBase } from "../hooks/useAIKnowledgeBases";

import type { AIKnowledgeFormValues } from "../components/AIKnowledgeForm";

/**
 * Edit AI knowledge base page.
 */
export function EditAIKnowledgePage(): React.JSX.Element {
  const navigate = useNavigate();
  const { knowledgeId = "" } = useParams<{ knowledgeId: string }>();

  const {
    data: knowledgeBase,
    isLoading,
    isError,
    error,
  } = useAIKnowledgeBase(knowledgeId);

  const updateKnowledgeBaseMutation = useUpdateAIKnowledgeBase();

  /**
   * Handles knowledge base updates.
   *
   * @param values - Knowledge base form values.
   */
  const handleSubmit = async (
    values: AIKnowledgeFormValues,
  ): Promise<void> => {
    await updateKnowledgeBaseMutation.mutateAsync({
      id: knowledgeId,
      payload: {
        name: values.name,
        description: values.description,
        visibility: values.visibility,
      },
    });

    navigate(`/ai/knowledge/${knowledgeId}`);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading knowledge base...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load knowledge base."}
      </div>
    );
  }

  if (!knowledgeBase) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Knowledge base not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Knowledge Base
        </h1>

        <p className="mt-2 text-gray-600">
          Update the knowledge base&apos;s name, description, or
          visibility.
        </p>
      </header>

      <AIKnowledgeForm
        initialValue={knowledgeBase}
        onSubmit={handleSubmit}
        isSubmitting={updateKnowledgeBaseMutation.isPending}
      />
    </div>
  );
}
