/**
 * AI thinking indicator component.
 */

import type { FC } from "react";

/**
 * AI thinking indicator.
 *
 * @returns AI thinking indicator component.
 */
export const AIThinkingIndicator: FC =
  (): React.JSX.Element => (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />

        <span
          className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
          style={{
            animationDelay:
              "150ms",
          }}
        />

        <span
          className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
          style={{
            animationDelay:
              "300ms",
          }}
        />
      </div>

      <span className="text-sm font-medium text-gray-600">
        AI is thinking...
      </span>
    </div>
  );