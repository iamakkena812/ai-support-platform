/**
 * AI knowledge base details page.
 */

import { useParams } from "react-router-dom";

import {
  AIKnowledgeStatusBadge,
  AIKnowledgeVisibilityBadge,
} from "../components/AIKnowledgeBadges";
import { useAIKnowledgeBase } from "../hooks/useAIKnowledgeBase";

/**
 * AI knowledge base details page.
 */
export function AIKnowledgeDetailsPage(): React.JSX.Element {
  const { knowledgeId = "" } = useParams<{ knowledgeId: string }>();

  const {
    data: knowledgeBase,
    isLoading,
    isError,
    error,
  } = useAIKnowledgeBase(knowledgeId);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading knowledge base...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load knowledge base."}
      </div>
    );
  }

  if (!knowledgeBase) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Knowledge base not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {knowledgeBase.name}
          </h1>

          <AIKnowledgeStatusBadge status={knowledgeBase.status} />
          <AIKnowledgeVisibilityBadge visibility={knowledgeBase.visibility} />
        </div>

        {knowledgeBase.description ? (
          <p className="mt-2 text-gray-600">{knowledgeBase.description}</p>
        ) : null}
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Details</h2>

        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>

            <dd className="mt-1 text-gray-900">{knowledgeBase.status}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Visibility</dt>

            <dd className="mt-1 text-gray-900">{knowledgeBase.visibility}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Created On</dt>

            <dd className="mt-1 text-gray-900">
              {new Date(knowledgeBase.createdAt).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Last Updated
            </dt>

            <dd className="mt-1 text-gray-900">
              {new Date(knowledgeBase.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-sm text-gray-500">
          Documents are registered against this knowledge base from the AI
          Documents page.
        </p>
      </section>
    </div>
  );
}
