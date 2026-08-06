/**
 * Create knowledge article page.
 */

import { useNavigate } from "react-router-dom";

import { KnowledgeArticleEditor } from "../components/KnowledgeArticleEditor";
import {
  createKnowledgeArticleSchema,
} from "../schemas/knowledgeBase.schema";
import {
  useCreateKnowledgeArticle,
} from "../hooks/useKnowledgeArticles";

import type {
  CreateKnowledgeArticleRequest,
} from "../types/knowledgeBase.types";

/**
 * Create knowledge article page.
 *
 * @returns Create knowledge article page component.
 */
export function CreateKnowledgeArticlePage(): React.JSX.Element {
  const navigate =
    useNavigate();

  const createMutation =
    useCreateKnowledgeArticle();

  /**
   * Handles article creation.
   *
   * @param values - Article values.
   */
  const handleSubmit =
    async (
      values: CreateKnowledgeArticleRequest,
    ): Promise<void> => {
      const validation =
        createKnowledgeArticleSchema.safeParse(
          values,
        );

      if (
        !validation.success
      ) {
        console.error(
          validation.error,
        );

        return;
      }

      try {
        const article =
          await createMutation.mutateAsync(
            validation.data,
          );

        navigate(
          `/knowledge-base/${article.id}`,
        );
      } catch (error) {
        console.error(
          "Failed to create knowledge article.",
          error,
        );
      }
    };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Create Knowledge Article
        </h1>

        <p className="mt-2 text-gray-600">
          Create a new article for
          the Knowledge Base.
        </p>
      </header>

      <KnowledgeArticleEditor
        isSubmitting={
          createMutation.isPending
        }
        onSubmit={
          handleSubmit
        }
      />
    </div>
  );
}