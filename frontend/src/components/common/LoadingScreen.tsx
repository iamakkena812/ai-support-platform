/**
 * Loading screen component.
 */

import { LoadingSpinner } from "./LoadingSpinner";

/**
 * Component properties.
 */
export interface LoadingScreenProps {
  /**
   * Loading message.
   */
  readonly message?: string;
}

/**
 * Loading screen.
 *
 * @param props Component properties.
 * @returns Loading screen.
 */
export function LoadingScreen({
  message = "Loading...",
}: LoadingScreenProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-100">
      <LoadingSpinner size={48} />

      <p className="text-slate-600">
        {message}
      </p>
    </div>
  );
}