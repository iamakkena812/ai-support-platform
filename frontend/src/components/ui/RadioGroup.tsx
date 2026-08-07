/**
 * Radio group component.
 *
 * Displays a reusable group of radio buttons.
 */

import type {
  InputHTMLAttributes,
} from "react";

/**
 * Radio option.
 */
export interface RadioOption {
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
export interface RadioGroupProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  > {
  /**
   * Group label.
   */
  readonly label?: string;

  /**
   * Radio group name.
   */
  readonly name: string;

  /**
   * Selected value.
   */
  readonly value: string;

  /**
   * Available options.
   */
  readonly options: readonly RadioOption[];

  /**
   * Helper text.
   */
  readonly helperText?: string;

  /**
   * Validation error.
   */
  readonly error?: string;

  /**
   * Value change handler.
   *
   * @param value Selected value.
   */
  readonly onChange: (
    value: string,
  ) => void;
}

/**
 * Radio group component.
 *
 * @param props Component properties.
 * @returns Radio group component.
 */
export function RadioGroup({
  label,
  name,
  value,
  options,
  helperText,
  error,
  disabled,
  onChange,
}: RadioGroupProps): React.JSX.Element {
  return (
    <fieldset className="space-y-2">
      {label ? (
        <legend className="text-sm font-medium text-slate-700">
          {label}
        </legend>
      ) : null}

      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-3"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={
                value === option.value
              }
              disabled={disabled}
              onChange={() =>
                onChange(option.value)
              }
              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <span className="text-sm text-slate-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {error ? (
        <p className="text-sm text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-slate-500">
          {helperText}
        </p>
      ) : null}
    </fieldset>
  );
}