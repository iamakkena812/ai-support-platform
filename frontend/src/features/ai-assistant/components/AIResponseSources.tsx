/**
 * AI response sources component.
 */

import type { FC } from "react";

import type {
  AISourceReference,
} from "../types/aiAssistant.types";

/**
 * Component properties.
 */
export interface AIResponseSourcesProps {
  /**
   * Source references.
   */
  readonly sources: readonly AISourceReference[];
}

/**
 * AI response sources.
 *
 * @param props - Component properties.
 * @returns AI response sources component.
 */
export const AIResponseSources: FC<
  AIResponseSourcesProps
> = ({
  sources,
}) => {
  if (
    sources.length === 0
  ) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-500">
        No sources available.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Sources
      </h3>

      <ul className="space-y-3">
        {sources.map(
          (
            source,
          ) => (
            <li
              key={
                source.id
              }
              className="rounded border border-gray-200 bg-white p-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">
                    {
                      source.title
                    }
                  </p>

                  {source.url ? (
                    <a
                      href={
                        source.url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate text-sm text-blue-600 hover:underline"
                    >
                      {
                        source.url
                      }
                    </a>
                  ) : null}
                </div>

                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  {Math.round(
                    source.score *
                      100,
                  )}
                  %
                </span>
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};