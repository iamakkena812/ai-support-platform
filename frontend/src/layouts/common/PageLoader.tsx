/**
 * Page loader component.
 *
 * Displays a loading indicator while page
 * content is being fetched.
 */

export interface PageLoaderProps {
  readonly message?: string;
}

/**
 * Page loader.
 */
export function PageLoader({
  message = "Loading...",
}: PageLoaderProps): React.JSX.Element {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"
        aria-hidden="true"
      />

      <p className="text-sm text-slate-500">
        {message}
      </p>
    </div>
  );
}