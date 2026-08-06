/**
 * Knowledge search component.
 *
 * Provides a reusable search input for the
 * Knowledge Base feature.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FC,
} from "react";

/**
 * Component properties.
 */
export interface KnowledgeSearchProps {
  /**
   * Initial search text.
   */
  readonly initialValue?: string;

  /**
   * Placeholder text.
   */
  readonly placeholder?: string;

  /**
   * Invoked when the search value changes.
   */
  readonly onSearch: (
    value: string,
  ) => void;
}

/**
 * Knowledge search.
 *
 * @param props - Component properties.
 * @returns Knowledge search component.
 */
export const KnowledgeSearch: FC<
  KnowledgeSearchProps
> = ({
  initialValue = "",
  placeholder = "Search knowledge articles...",
  onSearch,
}) => {
  const [value, setValue] =
    useState(
      initialValue,
    );

  useEffect(() => {
    onSearch(
      value.trim(),
    );
  }, [
    value,
    onSearch,
  ]);

  /**
   * Handles search input changes.
   *
   * @param event - Change event.
   */
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setValue(
      event.target.value,
    );
  };

  /**
   * Clears the search value.
   */
  const handleClear =
    (): void => {
      setValue(
        "",
      );
    };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <input
        type="search"
        value={value}
        onChange={
          handleChange
        }
        placeholder={
          placeholder
        }
        className="flex-1 rounded border border-gray-300 px-3 py-2 outline-none transition-colors focus:border-blue-500"
      />

      <button
        type="button"
        onClick={
          handleClear
        }
        disabled={
          value.length ===
          0
        }
        className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Clear
      </button>
    </div>
  );
};