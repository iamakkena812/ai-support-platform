/**
 * Badge component.
 *
 * Displays a reusable status badge.
 */

import type {
  HTMLAttributes,
} from "react";

/**
 * Badge variants.
 */
export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";

/**
 * Component properties.
 */
export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge variant.
   */
  readonly variant?: BadgeVariant;
}

/**
 * Returns variant classes.
 *
 * @param variant Badge variant.
 * @returns CSS classes.
 */
function getVariantClasses(
  variant: BadgeVariant,
): string {
  switch (variant) {
    case "secondary":
      return "bg-slate-100 text-slate-800";

    case "success":
      return "bg-green-100 text-green-800";

    case "warning":
      return "bg-yellow-100 text-yellow-800";

    case "danger":
      return "bg-red-100 text-red-800";

    case "info":
      return "bg-cyan-100 text-cyan-800";

    case "primary":
    default:
      return "bg-blue-100 text-blue-800";
  }
}

/**
 * Badge component.
 *
 * @param props Component properties.
 * @returns Badge component.
 */
export function Badge({
  variant = "primary",
  className = "",
  children,
  ...props
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        getVariantClasses(
          variant,
        ),
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}