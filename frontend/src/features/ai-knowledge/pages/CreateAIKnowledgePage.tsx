/**
 * Create AI knowledge base page.
 */

import { useNavigate } from "react-router-dom";

import { AIKnowledgeForm } from "../components/AIKnowledgeForm";
import { useCreateAIKnowledgeBase } from "../hooks/useAIKnowledgeBases";

import type { AIKnowledgeFormValues } from "../components/AIKnowledgeForm";

/**
 * Create AI knowledge base page.
 */
export function CreateAIKnowledgePage(): React.JSX.Element {
  const navigate = useNavigate();

  const createKnowledgeBaseMutation = useCreateAIKnowledgeBase();

  /**
   * Handles knowledge base creation.
   *
   * @param values - Knowledge base form values.
   */
  const handleSubmit = async (
    values: AIKnowledgeFormValues,
  ): Promise<void> => {
    await createKnowledgeBaseMutation.mutateAsync({
      name: values.name,
      description: values.description || undefined,
      visibility: values.visibility,
    });

    navigate("/ai/knowledge");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Create Knowledge Base
        </h1>

        <p className="mt-2 text-gray-600">
          Create a new knowledge base to organize AI documents under.
        </p>
      </header>

      <AIKnowledgeForm
        onSubmit={handleSubmit}
        isSubmitting={createKnowledgeBaseMutation.isPending}
      />
    </div>
  );
}
