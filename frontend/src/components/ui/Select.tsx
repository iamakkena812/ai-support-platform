/**
 * Select component.
 *
 * Reusable select input.
 */

import type {
  SelectHTMLAttributes,
} from "react";

import { forwardRef } from "react";

/**
 * Select option.
 */
export interface SelectOption {
  /**
   * Option label.
   */
  readonly label: string;

  /**
   * Option value.
   */
  readonly value: string;
}

/**
 * Component properties.
 */
export interface SelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "children"
  > {
  /**
   * Input label.
   */
  readonly label?: string;

  /**
   * Available options.
   */
  readonly options: readonly SelectOption[];

  /**
   * Placeholder option.
   */
  readonly placeholder?: string;

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
 * Select component.
 */
export const Select = forwardRef<
  HTMLSelectElement,
  SelectProps
>(function Select(
  {
    label,
    options,
    placeholder,
    error,
    helperText,
    className = "",
    id,
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

      <select
        ref={ref}
        id={id}
        className={[
          "w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none transition",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          "disabled:cursor-not-allowed disabled:bg-slate-100",
          className,
        ].join(" ")}
        {...props}
      >
        {placeholder ? (
          <option value="">
            {placeholder}
          </option>
        ) : null}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

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