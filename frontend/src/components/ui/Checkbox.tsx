/**
 * Checkbox component.
 *
 * Reusable checkbox input.
 */

import type {
  InputHTMLAttributes,
} from "react";

import { forwardRef } from "react";

/**
 * Component properties.
 */
export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  /**
   * Checkbox label.
   */
  readonly label?: string;

  /**
   * Helper text.
   */
  readonly helperText?: string;

  /**
   * Validation error.
   */
  readonly error?: string;
}

/**
 * Checkbox component.
 *
 * @param props Component properties.
 * @returns Checkbox component.
 */
export const Checkbox = forwardRef<
  HTMLInputElement,
  CheckboxProps
>(function Checkbox(
  {
    label,
    helperText,
    error,
    className = "",
    id,
    ...props
  },
  ref,
): React.JSX.Element {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3"
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={[
            "mt-1 h-4 w-4 rounded border-slate-300 text-blue-600",
            "focus:ring-2 focus:ring-blue-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          ].join(" ")}
          {...props}
        />

        <div>
          {label ? (
            <div className="text-sm font-medium text-slate-700">
              {label}
            </div>
          ) : null}

          {!error &&
          helperText ? (
            <div className="text-xs text-slate-500">
              {helperText}
            </div>
          ) : null}

          {error ? (
            <div className="text-xs text-red-600">
              {error}
            </div>
          ) : null}
        </div>
      </label>
    </div>
  );
});