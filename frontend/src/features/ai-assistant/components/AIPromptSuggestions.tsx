/**
 * AI prompt suggestions component.
 */

import type { FC } from "react";

/**
 * Component properties.
 */
export interface AIPromptSuggestionsProps {
  /**
   * Suggested prompts.
   */
  readonly prompts: readonly string[];

  /**
   * Invoked when a prompt is selected.
   *
   * @param prompt - Selected prompt.
   */
  readonly onSelect: (
    prompt: string,
  ) => void;
}

/**
 * AI prompt suggestions.
 *
 * @param props - Component properties.
 * @returns AI prompt suggestions component.
 */
export const AIPromptSuggestions: FC<
  AIPromptSuggestionsProps
> = ({
  prompts,
  onSelect,
}) => {
  if (
    prompts.length === 0
  ) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center text-sm text-gray-500">
        No prompt suggestions available.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Suggested Prompts
      </h3>

      <div className="flex flex-wrap gap-2">
        {prompts.map(
          (prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() =>
                onSelect(
                  prompt,
                )
              }
              className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-100"
            >
              {prompt}
            </button>
          ),
        )}
      </div>
    </div>
  );
};