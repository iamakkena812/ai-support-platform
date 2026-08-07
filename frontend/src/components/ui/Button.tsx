/**
 * Button component.
 *
 * Reusable application button.
 */

import type {
  ButtonHTMLAttributes,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "ghost";

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

/**
 * Component properties.
 */
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant.
   */
  readonly variant?: ButtonVariant;

  /**
   * Button size.
   */
  readonly size?: ButtonSize;

  /**
   * Loading state.
   */
  readonly loading?: boolean;
}

/**
 * Returns button variant classes.
 *
 * @param variant Button variant.
 * @returns CSS classes.
 */
function getVariantClasses(
  variant: ButtonVariant,
): string {
  switch (variant) {
    case "secondary":
      return "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100";

    case "danger":
      return "bg-red-600 text-white hover:bg-red-700";

    case "success":
      return "bg-green-600 text-white hover:bg-green-700";

    case "ghost":
      return "bg-transparent text-slate-700 hover:bg-slate-100";

    case "primary":
    default:
      return "bg-blue-600 text-white hover:bg-blue-700";
  }
}

/**
 * Returns button size classes.
 *
 * @param size Button size.
 * @returns CSS classes.
 */
function getSizeClasses(
  size: ButtonSize,
): string {
  switch (size) {
    case "sm":
      return "px-3 py-1.5 text-sm";

    case "lg":
      return "px-6 py-3 text-lg";

    case "md":
    default:
      return "px-4 py-2";
  }
}

/**
 * Button component.
 *
 * @param props Component properties.
 * @returns Button component.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center rounded-lg font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-50",
        getVariantClasses(variant),
        getSizeClasses(size),
        className,
      ].join(" ")}
      {...props}
    >
      {loading
        ? "Loading..."
        : children}
    </button>
  );
}