/**
 * Knowledge article list component.
 *
 * Displays a collection of knowledge articles.
 */

import type { FC } from "react";

import { KnowledgeArticleCard } from "./KnowledgeArticleCard";

import type {
  KnowledgeArticle,
} from "../types/knowledgeBase.types";

/**
 * Component properties.
 */
export interface KnowledgeArticleListProps {
  /**
   * Knowledge articles.
   */
  readonly articles: readonly KnowledgeArticle[];

  /**
   * Invoked when viewing an article.
   */
  readonly onView?: (
    article: KnowledgeArticle,
  ) => void;

  /**
   * Invoked when editing an article.
   */
  readonly onEdit?: (
    article: KnowledgeArticle,
  ) => void;

  /**
   * Invoked when deleting an article.
   */
  readonly onDelete?: (
    article: KnowledgeArticle,
  ) => void;
}

/**
 * Knowledge article list.
 *
 * @param props - Component properties.
 * @returns Knowledge article list component.
 */
export const KnowledgeArticleList: FC<
  KnowledgeArticleListProps
> = ({
  articles,
  onView,
  onEdit,
  onDelete,
}) => {
  if (
    articles.length === 0
  ) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        No knowledge articles found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map(
        (article) => (
          <KnowledgeArticleCard
            key={
              article.id
            }
            article={
              article
            }
            onView={
              onView
            }
            onEdit={
              onEdit
            }
            onDelete={
              onDelete
            }
          />
        ),
      )}
    </div>
  );
};