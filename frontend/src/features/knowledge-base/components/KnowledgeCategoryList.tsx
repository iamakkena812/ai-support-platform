/**
 * Knowledge category list component.
 *
 * Displays a collection of knowledge categories.
 */

import type { FC } from "react";

import type {
  KnowledgeCategory,
} from "../types/knowledgeBase.types";

/**
 * Component properties.
 */
export interface KnowledgeCategoryListProps {
  /**
   * Categories.
   */
  readonly categories: readonly KnowledgeCategory[];

  /**
   * Invoked when a category is selected.
   */
  readonly onSelect?: (
    category: KnowledgeCategory,
  ) => void;

  /**
   * Selected category identifier.
   */
  readonly selectedCategoryId?: string;
}

/**
 * Knowledge category list.
 *
 * @param props - Component properties.
 * @returns Knowledge category list component.
 */
export const KnowledgeCategoryList: FC<
  KnowledgeCategoryListProps
> = ({
  categories,
  onSelect,
  selectedCategoryId,
}) => {
  if (
    categories.length === 0
  ) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
        No categories available.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Categories
      </h2>

      <div className="space-y-2">
        {categories.map(
          (
            category,
          ) => {
            const isSelected =
              category.id ===
              selectedCategoryId;

            return (
              <button
                key={
                  category.id
                }
                type="button"
                onClick={() =>
                  onSelect?.(
                    category,
                  )
                }
                className={`flex w-full items-start justify-between rounded-md border px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="font-medium">
                    {
                      category.name
                    }
                  </div>

                  {category.description ? (
                    <p className="mt-1 text-sm text-gray-500">
                      {
                        category.description
                      }
                    </p>
                  ) : null}
                </div>
              </button>
            );
          },
        )}
      </div>
    </div>
  );
};