/**
 * AI knowledge base status and visibility badge components.
 */

import type { FC } from "react";

import type {
  AIKnowledgeStatus,
  AIKnowledgeVisibility,
} from "../types/aiKnowledge.types";

/**
 * Component properties.
 */
export interface AIKnowledgeStatusBadgeProps {
  /**
   * Knowledge base status.
   */
  readonly status: AIKnowledgeStatus;
}

/**
 * AI knowledge base status badge.
 *
 * @param props - Component properties.
 * @returns Status badge component.
 */
export const AIKnowledgeStatusBadge: FC<AIKnowledgeStatusBadgeProps> = ({
  status,
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
      status === "active"
        ? "border-green-300 bg-green-50 text-green-700"
        : "border-gray-300 bg-gray-100 text-gray-500"
    }`}
  >
    {status}
  </span>
);

/**
 * Component properties.
 */
export interface AIKnowledgeVisibilityBadgeProps {
  /**
   * Knowledge base visibility.
   */
  readonly visibility: AIKnowledgeVisibility;
}

/**
 * AI knowledge base visibility badge.
 *
 * @param props - Component properties.
 * @returns Visibility badge component.
 */
export const AIKnowledgeVisibilityBadge: FC<AIKnowledgeVisibilityBadgeProps> = ({
  visibility,
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
      visibility === "organization"
        ? "border-blue-300 bg-blue-50 text-blue-700"
        : "border-purple-300 bg-purple-50 text-purple-700"
    }`}
  >
    {visibility}
  </span>
);
