/**
 * Progress component.
 *
 * Displays progress information.
 */

import type {
  HTMLAttributes,
} from "react";

/**
 * Progress variants.
 */
export type ProgressVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger";

/**
 * Component properties.
 */
export interface ProgressProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Current value.
   */
  readonly value: number;

  /**
   * Maximum value.
   */
  readonly max?: number;

  /**
   * Optional label.
   */
  readonly label?: string;

  /**
   * Show percentage.
   */
  readonly showPercentage?: boolean;

  /**
   * Progress color.
   */
  readonly variant?: ProgressVariant;
}

/**
 * Returns variant classes.
 *
 * @param variant Progress variant.
 * @returns CSS classes.
 */
function getVariantClasses(
  variant: ProgressVariant,
): string {
  switch (variant) {
    case "success":
      return "bg-green-600";

    case "warning":
      return "bg-yellow-500";

    case "danger":
      return "bg-red-600";

    case "primary":
    default:
      return "bg-blue-600";
  }
}

/**
 * Progress component.
 *
 * @param props Component properties.
 * @returns Progress component.
 */
export function Progress({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = "primary",
  className = "",
  ...props
}: ProgressProps): React.JSX.Element {
  const percentage = Math.min(
    100,
    Math.max(
      0,
      (value / max) * 100,
    ),
  );

  return (
    <div
      className={className}
      {...props}
    >
      {(label ??
        showPercentage) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label ? (
            <span className="font-medium text-slate-700">
              {label}
            </span>
          ) : (
            <span />
          )}

          {showPercentage ? (
            <span className="text-slate-500">
              {Math.round(
                percentage,
              )}
              %
            </span>
          ) : null}
        </div>
      )}

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={[
            "h-full rounded-full transition-all duration-300",
            getVariantClasses(
              variant,
            ),
          ].join(" ")}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}