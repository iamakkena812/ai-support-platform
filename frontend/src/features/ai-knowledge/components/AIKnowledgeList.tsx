/**
 * AI knowledge base list component.
 *
 * Displays a collection of AI knowledge bases in a table.
 */

import type { FC } from "react";

import {
  AIKnowledgeStatusBadge,
  AIKnowledgeVisibilityBadge,
} from "./AIKnowledgeBadges";

import type { AIKnowledgeBase } from "../types/aiKnowledge.types";

/**
 * Component properties.
 */
export interface AIKnowledgeListProps {
  /**
   * Collection of knowledge bases.
   */
  readonly knowledgeBases: readonly AIKnowledgeBase[];

  /**
   * Identifier of the signed-in user. Only the creator of a knowledge
   * base may edit or delete it (see `AIKnowledgeService._ensure_owner`
   * on the backend), so edit/delete actions are hidden for knowledge
   * bases owned by someone else rather than shown and left to fail.
   */
  readonly currentUserId: string;

  /**
   * Invoked when a knowledge base is selected.
   */
  readonly onView?: (knowledgeBase: AIKnowledgeBase) => void;

  /**
   * Invoked when editing a knowledge base.
   */
  readonly onEdit?: (knowledgeBase: AIKnowledgeBase) => void;

  /**
   * Invoked when deleting a knowledge base.
   */
  readonly onDelete?: (knowledgeBase: AIKnowledgeBase) => void;
}

/**
 * AI knowledge base list.
 *
 * @param props - Component properties.
 * @returns AI knowledge base list component.
 */
export const AIKnowledgeList: FC<AIKnowledgeListProps> = ({
  knowledgeBases,
  currentUserId,
  onView,
  onEdit,
  onDelete,
}) => {
  if (knowledgeBases.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        No knowledge bases found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Name
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Visibility
            </th>

            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Created
            </th>

            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {knowledgeBases.map((knowledgeBase) => (
            <tr
              key={knowledgeBase.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onView?.(knowledgeBase)}
            >
              <td className="max-w-xs truncate px-4 py-3 text-sm font-medium text-gray-900">
                {knowledgeBase.name}
              </td>

              <td className="px-4 py-3">
                <AIKnowledgeStatusBadge status={knowledgeBase.status} />
              </td>

              <td className="px-4 py-3">
                <AIKnowledgeVisibilityBadge
                  visibility={knowledgeBase.visibility}
                />
              </td>

              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(knowledgeBase.createdAt).toLocaleDateString()}
              </td>

              <td className="px-4 py-3 text-right">
                {knowledgeBase.createdBy === currentUserId ? (
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit?.(knowledgeBase);
                      }}
                      className="rounded border border-blue-300 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete?.(knowledgeBase);
                      }}
                      className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Read only</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
