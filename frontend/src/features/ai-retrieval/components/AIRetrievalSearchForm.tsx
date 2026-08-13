/**
 * AI Retrieval search form.
 *
 * Lets the caller submit a query against local keyword retrieval,
 * hybrid retrieval, or a metadata filter.
 */

import { type FC, type FormEvent, useState } from "react";

import type { AIRetrievalMode } from "../types/aiRetrieval.types";

/**
 * Component properties.
 */
export interface AIRetrievalSearchFormProps {
  /**
   * Whether a search is currently in flight.
   */
  readonly isSearching: boolean;

  /**
   * Invoked when the user submits a search.
   */
  readonly onSearch: (params: {
    readonly mode: AIRetrievalMode;
    readonly query: string;
    readonly topK: number;
  }) => void;
}

const MODE_OPTIONS: ReadonlyArray<{
  readonly value: AIRetrievalMode;
  readonly label: string;
}> = [
  { value: "keyword", label: "Keyword Search" },
  { value: "hybrid", label: "Hybrid Search" },
  { value: "metadata", label: "Metadata Search" },
];

/**
 * AI Retrieval search form.
 *
 * @param props - Component properties.
 * @returns Search form component.
 */
export const AIRetrievalSearchForm: FC<AIRetrievalSearchFormProps> = ({
  isSearching,
  onSearch,
}) => {
  const [mode, setMode] = useState<AIRetrievalMode>("keyword");
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (mode !== "metadata" && query.trim().length === 0) {
      return;
    }

    onSearch({ mode, query: query.trim(), topK });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-wrap gap-2">
        {MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              mode === option.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {mode === "hybrid" ? (
        <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Hybrid search combines the keyword signal with a semantic
          (vector) signal. No embedding provider is configured, so only
          the keyword contribution is available -- semantic relevance is
          unavailable.
        </p>
      ) : null}

      {mode !== "metadata" ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search indexed content..."
            className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />

          <input
            type="number"
            min={1}
            max={50}
            value={topK}
            onChange={(event) => setTopK(Number(event.target.value))}
            title="Maximum results"
            className="w-24 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isSearching || query.trim().length === 0}
            className="rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="flex-1 text-sm text-gray-500">
            Returns every embedding in your organization (no filters
            applied). Add metadata filters via the API for narrower
            results.
          </p>

          <button
            type="submit"
            disabled={isSearching}
            className="rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      )}
    </form>
  );
};
