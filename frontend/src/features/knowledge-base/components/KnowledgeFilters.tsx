/**
 * Knowledge Base filters component.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FC,
} from "react";

import type {
  KnowledgeArticleStatus,
  KnowledgeFilterState,
} from "../types/knowledgeBase.types";

/**
 * Component properties.
 */
export interface KnowledgeFiltersProps {
  /**
   * Initial filter values.
   */
  readonly initialValue?: KnowledgeFilterState;

  /**
   * Invoked when filters change.
   */
  readonly onChange: (
    filters: KnowledgeFilterState,
  ) => void;
}

/**
 * Knowledge Base filters.
 *
 * @param props - Component properties.
 * @returns Knowledge Base filters component.
 */
export const KnowledgeFilters: FC<
  KnowledgeFiltersProps
> = ({
  initialValue,
  onChange,
}) => {
  const [filters, setFilters] =
    useState<KnowledgeFilterState>(
      initialValue ?? {},
    );

  useEffect(() => {
    onChange(
      filters,
    );
  }, [
    filters,
    onChange,
  ]);

  /**
   * Updates the search value.
   *
   * @param event - Change event.
   */
  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setFilters(
      (
        previous,
      ) => ({
        ...previous,
        search:
          event.target.value ||
          undefined,
      }),
    );
  };

  /**
   * Updates the category.
   *
   * @param event - Change event.
   */
  const handleCategoryChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    setFilters(
      (
        previous,
      ) => ({
        ...previous,
        categoryId:
          event.target.value ||
          undefined,
      }),
    );
  };

  /**
   * Updates the status.
   *
   * @param event - Change event.
   */
  const handleStatusChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const value =
      event.target
        .value;

    setFilters(
      (
        previous,
      ) => ({
        ...previous,
        status:
          value === ""
            ? undefined
            : (value as KnowledgeArticleStatus),
      }),
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Search
          </label>

          <input
            type="text"
            value={
              filters.search ??
              ""
            }
            onChange={
              handleSearchChange
            }
            placeholder="Search articles..."
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            value={
              filters.categoryId ??
              ""
            }
            onChange={
              handleCategoryChange
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">
              All Categories
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={
              filters.status ??
              ""
            }
            onChange={
              handleStatusChange
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">
              All Statuses
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="published">
              Published
            </option>

            <option value="archived">
              Archived
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};