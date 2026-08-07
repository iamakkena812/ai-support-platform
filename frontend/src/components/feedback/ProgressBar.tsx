/**
 * Progress bar component.
 *
 * Displays a lightweight progress indicator.
 */

import type {
  HTMLAttributes,
} from "react";

/**
 * Progress bar variants.
 */
export type ProgressBarVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger";

/**
 * Component properties.
 */
export interface ProgressBarProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Progress value.
   */
  readonly value: number;

  /**
   * Maximum value.
   */
  readonly max?: number;

  /**
   * Progress color.
   */
  readonly variant?: ProgressBarVariant;

  /**
   * Progress bar height.
   */
  readonly height?: number;
}

/**
 * Returns variant classes.
 *
 * @param variant Progress variant.
 * @returns CSS classes.
 */
function getVariantClasses(
  variant: ProgressBarVariant,
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
 * Progress bar component.
 *
 * @param props Component properties.
 * @returns Progress bar component.
 */
export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  height = 6,
  className = "",
  ...props
}: ProgressBarProps): React.JSX.Element {
  const percentage = Math.min(
    100,
    Math.max(
      0,
      (value / max) * 100,
    ),
  );

  return (
    <div
      className={[
        "w-full overflow-hidden rounded-full bg-slate-200",
        className,
      ].join(" ")}
      style={{
        height,
      }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      {...props}
    >
      <div
        className={[
          "h-full rounded-full transition-all duration-300 ease-out",
          getVariantClasses(
            variant,
          ),
        ].join(" ")}
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}