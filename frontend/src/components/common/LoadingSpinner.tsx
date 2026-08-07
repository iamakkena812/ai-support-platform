/**
 * Loading spinner component.
 *
 * Displays a reusable loading spinner.
 */

import { LoaderCircle } from "lucide-react";

/**
 * Component properties.
 */
export interface LoadingSpinnerProps {
  /**
   * Spinner size.
   */
  readonly size?: number;

  /**
   * Additional CSS classes.
   */
  readonly className?: string;
}

/**
 * Loading spinner.
 *
 * @param props Component properties.
 * @returns Loading spinner.
 */
export function LoadingSpinner({
  size = 32,
  className = "",
}: LoadingSpinnerProps): React.JSX.Element {
  return (
    <LoaderCircle
      size={size}
      className={`animate-spin text-blue-600 ${className}`}
    />
  );
}