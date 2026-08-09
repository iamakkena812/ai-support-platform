/**
 * Permission error state.
 *
 * Displays an accessible error message when permission
 * data cannot be loaded or an operation fails.
 */

/**
 * Permission error properties.
 */
export interface PermissionErrorProps {
  /**
   * Error message.
   */
  readonly message?: string;

  /**
   * Optional retry callback.
   */
  readonly onRetry?: () => void;
}

/**
 * Permission error state.
 *
 * @param props - Component properties.
 * @returns Permission error message.
 */
export function PermissionError({
  message = "Unable to load permissions. Please try again.",
  onRetry,
}: PermissionErrorProps) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-6"
      role="alert"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-red-800">
            Permission error
          </h3>

          <p className="mt-1 text-sm text-red-700">
            {message}
          </p>
        </div>

        {onRetry !== undefined && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex shrink-0 items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}