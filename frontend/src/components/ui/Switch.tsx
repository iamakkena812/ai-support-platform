/**
 * Switch component.
 *
 * Displays a reusable toggle switch.
 */

import type {
  ButtonHTMLAttributes,
} from "react";

/**
 * Component properties.
 */
export interface SwitchProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange"
  > {
  /**
   * Switch label.
   */
  readonly label?: string;

  /**
   * Current state.
   */
  readonly checked: boolean;

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
   * @param checked New value.
   */
  readonly onChange: (
    checked: boolean,
  ) => void;
}

/**
 * Switch component.
 *
 * @param props Component properties.
 * @returns Switch component.
 */
export function Switch({
  label,
  checked,
  helperText,
  error,
  disabled = false,
  onChange,
}: SwitchProps): React.JSX.Element {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-4">
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

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() =>
            onChange(!checked)
          }
          className={[
            "relative inline-flex h-6 w-11 items-center rounded-full transition",
            checked
              ? "bg-blue-600"
              : "bg-slate-300",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer",
          ].join(" ")}
        >
          <span
            className={[
              "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
              checked
                ? "translate-x-5"
                : "translate-x-1",
            ].join(" ")}
          />
        </button>
      </div>
    </div>
  );
}