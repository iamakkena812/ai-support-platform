/**
 * AI document status badge component.
 */

import type { FC } from "react";

import type { AIDocumentStatus } from "../types/aiDocument.types";

/**
 * Component properties.
 */
export interface AIDocumentStatusBadgeProps {
  /**
   * Document status.
   */
  readonly status: AIDocumentStatus;
}

/**
 * Maps a document status to badge styling.
 *
 * @param status - Document status.
 * @returns Tailwind class names.
 */
function statusClassName(status: AIDocumentStatus): string {
  switch (status) {
    case "indexed":
    case "embedded":
      return "border-green-300 bg-green-50 text-green-700";
    case "failed":
      return "border-red-300 bg-red-50 text-red-700";
    case "deleted":
      return "border-gray-300 bg-gray-100 text-gray-500";
    case "registered":
      return "border-gray-300 bg-gray-50 text-gray-700";
    default:
      return "border-blue-300 bg-blue-50 text-blue-700";
  }
}

/**
 * AI document status badge.
 *
 * @param props - Component properties.
 * @returns Status badge component.
 */
export const AIDocumentStatusBadge: FC<AIDocumentStatusBadgeProps> = ({
  status,
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusClassName(status)}`}
  >
    {status}
  </span>
);
