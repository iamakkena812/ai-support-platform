/**
 * Knowledge Base utility functions.
 */

import type {
  KnowledgeArticleStatus,
} from "../types/knowledgeBase.types";

/**
 * Formats a knowledge article status.
 *
 * @param status - Article status.
 * @returns Formatted status.
 */
export function formatKnowledgeArticleStatus(
  status: KnowledgeArticleStatus,
): string {
  switch (
    status
  ) {
    case "draft":
      return "Draft";

    case "published":
      return "Published";

    case "archived":
      return "Archived";

    default:
      return status;
  }
}

/**
 * Formats a date for display.
 *
 * @param value - ISO date string.
 * @returns Formatted date.
 */
export function formatKnowledgeDate(
  value: string,
): string {
  return new Date(
    value,
  ).toLocaleString();
}

/**
 * Generates a slug from a title.
 *
 * @param title - Article title.
 * @returns URL-friendly slug.
 */
export function createKnowledgeSlug(
  title: string,
): string {
  return title
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

/**
 * Estimates article reading time.
 *
 * @param content - Article content.
 * @returns Estimated reading time.
 */
export function estimateReadingTime(
  content: string,
): string {
  const words =
    content
      .trim()
      .split(
        /\s+/,
      )
      .filter(
        Boolean,
      ).length;

  const minutes =
    Math.max(
      1,
      Math.ceil(
        words / 200,
      ),
    );

  return `${minutes} min read`;
}

/**
 * Truncates article content.
 *
 * @param content - Article content.
 * @param length - Maximum length.
 * @returns Truncated content.
 */
export function truncateKnowledgeContent(
  content: string,
  length = 200,
): string {
  if (
    content.length <=
    length
  ) {
    return content;
  }

  return `${content.slice(
    0,
    length,
  )}...`;
}