/**
 * Skeleton component.
 *
 * Displays an animated placeholder while
 * content is loading.
 */

import type {
  HTMLAttributes,
} from "react";

/**
 * Skeleton variants.
 */
export type SkeletonVariant =
  | "text"
  | "title"
  | "circle"
  | "rectangle";

/**
 * Component properties.
 */
export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Skeleton variant.
   */
  readonly variant?: SkeletonVariant;

  /**
   * Skeleton width.
   */
  readonly width?: string | number;

  /**
   * Skeleton height.
   */
  readonly height?: string | number;
}

/**
 * Returns variant classes.
 *
 * @param variant Skeleton variant.
 * @returns Tailwind CSS classes.
 */
function getVariantClasses(
  variant: SkeletonVariant,
): string {
  switch (variant) {
    case "title":
      return "h-8 w-64 rounded";

    case "circle":
      return "h-12 w-12 rounded-full";

    case "rectangle":
      return "rounded-lg";

    case "text":
    default:
      return "h-4 w-full rounded";
  }
}

/**
 * Skeleton component.
 *
 * @param props Component properties.
 * @returns Skeleton component.
 */
export function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps): React.JSX.Element {
  return (
    <div
      className={[
        "animate-pulse bg-slate-200",
        getVariantClasses(
          variant,
        ),
        className,
      ].join(" ")}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}