/**
 * Textarea component.
 *
 * Reusable multiline text input.
 */

import type {
  TextareaHTMLAttributes,
} from "react";

import { forwardRef } from "react";

/**
 * Component properties.
 */
export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea label.
   */
  readonly label?: string;

  /**
   * Validation error.
   */
  readonly error?: string;

  /**
   * Helper text.
   */
  readonly helperText?: string;
}

/**
 * Textarea component.
 */
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(function Textarea(
  {
    label,
    error,
    helperText,
    className = "",
    id,
    rows = 4,
    ...props
  },
  ref,
): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={[
          "w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none transition resize-y",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          "disabled:cursor-not-allowed disabled:bg-slate-100",
          className,
        ].join(" ")}
        {...props}
      />

      {error ? (
        <p className="text-sm text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});