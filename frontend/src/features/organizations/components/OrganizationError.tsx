/**
 * Organization error component.
 *
 * Displays an error state when organization
 * data cannot be loaded.
 */

import {
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

/**
 * Component properties.
 */
export interface OrganizationErrorProps {
  /**
   * Error object.
   */
  readonly error?: Error | null;

  /**
   * Retry callback.
   */
  readonly onRetry?: () => void;
}

/**
 * Organization error component.
 *
 * @param props Component properties.
 * @returns Organization error component.
 */
export function OrganizationError({
  error,
  onRetry,
}: OrganizationErrorProps): React.JSX.Element {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="w-full max-w-xl rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle
            size={32}
            className="text-red-600"
          />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-red-700">
          Unable to Load Organizations
        </h2>

        <p className="mt-3 text-sm text-red-600">
          {error?.message ??
            "An unexpected error occurred while loading organization data."}
        </p>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
          >
            <RotateCcw size={18} />

            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}