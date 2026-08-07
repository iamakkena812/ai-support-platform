/**
 * Alert component.
 *
 * Displays contextual feedback messages.
 */

import type {
  ReactNode,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

/**
 * Alert variants.
 */
export type AlertVariant =
  | "success"
  | "error"
  | "warning"
  | "info";

/**
 * Component properties.
 */
export interface AlertProps {
  /**
   * Alert title.
   */
  readonly title: string;

  /**
   * Optional description.
   */
  readonly description?: string;

  /**
   * Alert variant.
   */
  readonly variant?: AlertVariant;

  /**
   * Optional action.
   */
  readonly action?: ReactNode;

  /**
   * Dismiss callback.
   */
  readonly onClose?: () => void;
}

/**
 * Returns variant styles.
 *
 * @param variant Alert variant.
 * @returns CSS classes.
 */
function getVariantClasses(
  variant: AlertVariant,
): {
  readonly container: string;
  readonly icon: React.JSX.Element;
} {
  switch (variant) {
    case "success":
      return {
        container:
          "border-green-200 bg-green-50 text-green-900",
        icon: (
          <CheckCircle2
            size={22}
            className="text-green-600"
          />
        ),
      };

    case "warning":
      return {
        container:
          "border-yellow-200 bg-yellow-50 text-yellow-900",
        icon: (
          <TriangleAlert
            size={22}
            className="text-yellow-600"
          />
        ),
      };

    case "error":
      return {
        container:
          "border-red-200 bg-red-50 text-red-900",
        icon: (
          <AlertCircle
            size={22}
            className="text-red-600"
          />
        ),
      };

    default:
      return {
        container:
          "border-blue-200 bg-blue-50 text-blue-900",
        icon: (
          <Info
            size={22}
            className="text-blue-600"
          />
        ),
      };
  }
}

/**
 * Alert component.
 *
 * @param props Component properties.
 * @returns Alert component.
 */
export function Alert({
  title,
  description,
  variant = "info",
  action,
  onClose,
}: AlertProps): React.JSX.Element {
  const styles =
    getVariantClasses(
      variant,
    );

  return (
    <div
      className={[
        "flex items-start gap-4 rounded-lg border p-4",
        styles.container,
      ].join(" ")}
      role="alert"
    >
      {styles.icon}

      <div className="flex-1">
        <h3 className="font-semibold">
          {title}
        </h3>

        {description ? (
          <p className="mt-1 text-sm">
            {description}
          </p>
        ) : null}

        {action ? (
          <div className="mt-4">
            {action}
          </div>
        ) : null}
      </div>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 transition hover:bg-black/5"
          aria-label="Dismiss alert"
        >
          <X size={18} />
        </button>
      ) : null}
    </div>
  );
}