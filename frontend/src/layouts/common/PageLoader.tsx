/**
 * Page loader component.
 *
 * Displays a loading indicator while page
 * content is being fetched.
 */

import { LoaderCircle } from "lucide-react";

/**
 * Component properties.
 */
export interface PageLoaderProps {
  /**
   * Loading message.
   */
  readonly message?: string;
}

/**
 * Page loader.
 *
 * @param props Component properties.
 * @returns Page loader component.
 */
export function PageLoader({
  message = "Loading...",
}: PageLoaderProps): React.JSX.Element {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg bg-white">
      <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" />

      <p className="text-sm font-medium text-slate-600">
        {message}
      </p>
    </div>
  );
}