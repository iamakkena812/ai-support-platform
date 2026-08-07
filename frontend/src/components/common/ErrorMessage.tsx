/**
 * Error message component.
 */

import { AlertTriangle } from "lucide-react";

/**
 * Component properties.
 */
export interface ErrorMessageProps {
  readonly message: string;
}

/**
 * Error message.
 */
export function ErrorMessage({
  message,
}: ErrorMessageProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600" />

        <span className="text-red-700">
          {message}
        </span>
      </div>
    </div>
  );
}