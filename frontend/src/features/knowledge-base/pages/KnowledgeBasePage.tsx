/**
 * Knowledge Base page.
 */

import {
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { KnowledgeArticleList } from "../components/KnowledgeArticleList";
import { KnowledgeFilters } from "../components/KnowledgeFilters";
import {
  useDeleteKnowledgeArticle,
  useKnowledgeArticles,
} from "../hooks/useKnowledgeArticles";

import type {
  KnowledgeArticle,
  KnowledgeFilterState,
} from "../types/knowledgeBase.types";

/**
 * Knowledge Base page.
 *
 * @returns Knowledge Base page component.
 */
export function KnowledgeBasePage(): React.JSX.Element {
  const navigate =
    useNavigate();

  const [filters, setFilters] =
    useState<KnowledgeFilterState>(
      {},
    );

  const query = useMemo(
    () => ({
      page: 1,
      pageSize: 10,
      filters,
    }),
    [filters],
  );

  const {
    data,
    isLoading,
    isError,
    error,
  } = useKnowledgeArticles(
    query,
  );

  const deleteMutation =
    useDeleteKnowledgeArticle();

  /**
   * Handles viewing an article.
   *
   * @param article - Selected article.
   */
  const handleView = (
    article: KnowledgeArticle,
  ): void => {
    navigate(
      `/knowledge-base/${article.id}`,
    );
  };

  /**
   * Handles editing an article.
   *
   * @param article - Selected article.
   */
  const handleEdit = (
    article: KnowledgeArticle,
  ): void => {
    navigate(
      `/knowledge-base/${article.id}/edit`,
    );
  };

  /**
   * Handles deleting an article.
   *
   * @param article - Selected article.
   */
  const handleDelete =
    async (
      article: KnowledgeArticle,
    ): Promise<void> => {
      try {
        await deleteMutation.mutateAsync(
          article.id,
        );
      } catch (deleteError) {
        console.error(
          "Failed to delete article.",
          deleteError,
        );
      }
    };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading knowledge articles...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load knowledge articles."}
      </div>
    );
  }

  const articles =
    data?.items ?? [];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Knowledge Base
          </h1>

          <p className="mt-2 text-gray-600">
            Browse, search, and manage
            knowledge articles.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/knowledge-base/new",
            )
          }
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Create Article
        </button>
      </header>

      <KnowledgeFilters
        initialValue={
          filters
        }
        onChange={
          setFilters
        }
      />

      <KnowledgeArticleList
        articles={
          articles
        }
        onView={
          handleView
        }
        onEdit={
          handleEdit
        }
        onDelete={
          handleDelete
        }
      />
    </div>
  );
}