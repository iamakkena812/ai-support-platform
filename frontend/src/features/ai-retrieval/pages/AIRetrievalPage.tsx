/**
 * AI Retrieval page.
 */

import { useState } from "react";

import { AIRetrievalResultsList } from "../components/AIRetrievalResultsList";
import { AIRetrievalSearchForm } from "../components/AIRetrievalSearchForm";
import {
  useAIRetrievalStatistics,
  useHybridRetrieveDocuments,
  useMetadataSearchDocuments,
  useRetrieveDocuments,
} from "../hooks/useAIRetrieval";

import type { AIRetrievalMode } from "../types/aiRetrieval.types";

/**
 * AI Retrieval page.
 *
 * Lets the caller search embeddings indexed for their organization
 * using local keyword retrieval, hybrid retrieval, or metadata filters.
 *
 * @returns AI Retrieval page component.
 */
export function AIRetrievalPage(): React.JSX.Element {
  const [hasSearched, setHasSearched] = useState(false);

  const { data: statistics } = useAIRetrievalStatistics();

  const retrieveMutation = useRetrieveDocuments();
  const hybridMutation = useHybridRetrieveDocuments();
  const metadataMutation = useMetadataSearchDocuments();

  const isSearching =
    retrieveMutation.isPending ||
    hybridMutation.isPending ||
    metadataMutation.isPending;

  const lastResult =
    retrieveMutation.data ?? hybridMutation.data ?? metadataMutation.data;

  const lastError =
    retrieveMutation.error ?? hybridMutation.error ?? metadataMutation.error;

  /**
   * Handles a search submission for the selected mode.
   *
   * @param params - Search parameters from the form.
   */
  const handleSearch = (params: {
    readonly mode: AIRetrievalMode;
    readonly query: string;
    readonly topK: number;
  }): void => {
    setHasSearched(true);

    if (params.mode === "keyword") {
      retrieveMutation.mutate({ query: params.query, topK: params.topK });
      return;
    }

    if (params.mode === "hybrid") {
      hybridMutation.mutate({ query: params.query, topK: params.topK });
      return;
    }

    metadataMutation.mutate({ metadata: {}, limit: params.topK });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Retrieval</h1>

          <p className="mt-1 text-gray-600">
            Search embeddings indexed for your organization.
          </p>
        </div>

        {statistics ? (
          <span className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-600">
            {statistics.totalDocuments} indexed document
            {statistics.totalDocuments === 1 ? "" : "s"}
          </span>
        ) : null}
      </header>

      <AIRetrievalSearchForm
        isSearching={isSearching}
        onSearch={handleSearch}
      />

      {lastError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {lastError instanceof Error
            ? lastError.message
            : "Search failed. Please try again."}
        </div>
      ) : null}

      {isSearching ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Searching...
        </div>
      ) : null}

      {!isSearching && !lastError ? (
        <AIRetrievalResultsList
          documents={lastResult?.documents ?? []}
          hasSearched={hasSearched}
        />
      ) : null}
    </div>
  );
}
