/**
 * AI Retrieval results list.
 *
 * Displays retrieved documents with their real relevance score and
 * metadata.
 */

import type { FC } from "react";

import type { AIRetrievedDocument } from "../types/aiRetrieval.types";

/**
 * Component properties.
 */
export interface AIRetrievalResultsListProps {
  /**
   * Retrieved documents, already ranked by the backend.
   */
  readonly documents: readonly AIRetrievedDocument[];

  /**
   * Whether a search has been submitted yet.
   */
  readonly hasSearched: boolean;
}

/**
 * AI Retrieval results list.
 *
 * @param props - Component properties.
 * @returns Results list component.
 */
export const AIRetrievalResultsList: FC<AIRetrievalResultsListProps> = ({
  documents,
  hasSearched,
}) => {
  if (!hasSearched) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        Submit a search to see results.
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        No matching documents found.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {documents.map((document) => (
        <li
          key={document.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-gray-900">{document.content}</p>

            <span className="shrink-0 rounded-full border border-blue-300 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {document.score.toFixed(2)}
            </span>
          </div>

          {Object.keys(document.metadata).length > 0 ? (
            <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              {Object.entries(document.metadata).map(([key, value]) => (
                <div key={key} className="flex gap-1">
                  <dt className="font-medium">{key}:</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </li>
      ))}
    </ul>
  );
};
