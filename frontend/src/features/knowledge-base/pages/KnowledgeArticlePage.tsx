/**
 * Knowledge article page.
 */

import { useNavigate, useParams } from "react-router-dom";

import { KnowledgeArticleCard } from "../components/KnowledgeArticleCard";
import { useKnowledgeArticle } from "../hooks/useKnowledgeArticle";

/**
 * Knowledge article page.
 *
 * @returns Knowledge article page component.
 */
export function KnowledgeArticlePage(): React.JSX.Element {
  const navigate =
    useNavigate();

  const {
    articleId = "",
  } = useParams<{
    articleId: string;
  }>();

  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useKnowledgeArticle(
    articleId,
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading article...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load article."}
      </div>
    );
  }

  if (!article) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Knowledge article not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {article.title}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Last updated{" "}
            {new Date(
              article.updatedAt,
            ).toLocaleString()}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/knowledge-base/${article.id}/edit`,
            )
          }
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Edit Article
        </button>
      </header>

      <KnowledgeArticleCard
        article={article}
      />

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Article Content
        </h2>

        <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
          {article.content}
        </div>
      </section>
    </div>
  );
}