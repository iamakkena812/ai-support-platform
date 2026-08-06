/**
 * Knowledge article card component.
 *
 * Displays a single knowledge article.
 */

import type { FC } from "react";

import type {
  KnowledgeArticle,
} from "../types/knowledgeBase.types";

/**
 * Component properties.
 */
export interface KnowledgeArticleCardProps {
  /**
   * Knowledge article.
   */
  readonly article: KnowledgeArticle;

  /**
   * Invoked when viewing the article.
   */
  readonly onView?: (
    article: KnowledgeArticle,
  ) => void;

  /**
   * Invoked when editing the article.
   */
  readonly onEdit?: (
    article: KnowledgeArticle,
  ) => void;

  /**
   * Invoked when deleting the article.
   */
  readonly onDelete?: (
    article: KnowledgeArticle,
  ) => void;
}

/**
 * Knowledge article card.
 *
 * @param props - Component properties.
 * @returns Knowledge article card component.
 */
export const KnowledgeArticleCard: FC<
  KnowledgeArticleCardProps
> = ({
  article,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold text-gray-900">
          {article.title}
        </h3>

        <p className="mt-1 text-sm text-gray-600">
          {article.summary ??
            "No summary available."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ),
          )}
        </div>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          article.status ===
          "published"
            ? "bg-green-100 text-green-700"
            : article.status ===
                "draft"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-700"
        }`}
      >
        {article.status}
      </span>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-600 md:grid-cols-4">
      <div>
        <p className="font-medium text-gray-900">
          Category
        </p>

        <p>
          {
            article.category
              .name
          }
        </p>
      </div>

      <div>
        <p className="font-medium text-gray-900">
          Author
        </p>

        <p>
          {
            article.authorName
          }
        </p>
      </div>

      <div>
        <p className="font-medium text-gray-900">
          Views
        </p>

        <p>
          {
            article.viewCount
          }
        </p>
      </div>

      <div>
        <p className="font-medium text-gray-900">
          Updated
        </p>

        <p>
          {new Date(
            article.updatedAt,
          ).toLocaleDateString()}
        </p>
      </div>
    </div>

    <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={() =>
          onView?.(
            article,
          )
        }
        className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100"
      >
        View
      </button>

      <button
        type="button"
        onClick={() =>
          onEdit?.(
            article,
          )
        }
        className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-50"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={() =>
          onDelete?.(
            article,
          )
        }
        className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  </div>
);