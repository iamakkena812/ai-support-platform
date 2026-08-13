/**
 * Register AI document page.
 */

import { useNavigate } from "react-router-dom";

import { AIDocumentForm } from "../components/AIDocumentForm";
import {
  useAIKnowledgeBaseOptions,
  useCreateAIDocument,
} from "../hooks/useAIDocuments";

import type { AIDocumentFormValues } from "../components/AIDocumentForm";

/**
 * Register AI document page.
 */
export function CreateAIDocumentPage(): React.JSX.Element {
  const navigate = useNavigate();

  const {
    data: knowledgeBaseOptions,
    isLoading: isLoadingKnowledgeBases,
    isError: isKnowledgeBaseError,
  } = useAIKnowledgeBaseOptions();

  const createDocumentMutation = useCreateAIDocument();

  /**
   * Handles document registration.
   *
   * @param values - Document form values.
   */
  const handleSubmit = async (values: AIDocumentFormValues): Promise<void> => {
    await createDocumentMutation.mutateAsync({
      knowledgeId: values.knowledgeId,
      filename: values.filename,
      originalFilename: values.originalFilename,
      contentType: values.contentType,
      fileSize: values.fileSize,
      storagePath: values.storagePath,
      checksum: values.checksum,
    });

    navigate("/ai/documents");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Register Document
        </h1>

        <p className="mt-2 text-gray-600">
          Register a new document against one of your organization&apos;s
          AI knowledge bases.
        </p>
      </header>

      {isLoadingKnowledgeBases ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading knowledge bases...
        </div>
      ) : null}

      {isKnowledgeBaseError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load knowledge bases.
        </div>
      ) : null}

      {!isLoadingKnowledgeBases && !isKnowledgeBaseError ? (
        <AIDocumentForm
          knowledgeBaseOptions={knowledgeBaseOptions ?? []}
          onSubmit={handleSubmit}
          isSubmitting={createDocumentMutation.isPending}
        />
      ) : null}
    </div>
  );
}
