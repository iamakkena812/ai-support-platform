/**
 * Toast component.
 *
 * Displays temporary notification messages.
 */

import type {
  ReactNode,
} from "react";

import {
  CheckCircle2,
  CircleAlert,
  Info,
  X,
  XCircle,
} from "lucide-react";

/**
 * Toast variants.
 */
export type ToastVariant =
  | "success"
  | "error"
  | "warning"
  | "info";

/**
 * Component properties.
 */
export interface ToastProps {
  /**
   * Toast title.
   */
  readonly title: string;

  /**
   * Optional description.
   */
  readonly description?: string;

  /**
   * Toast variant.
   */
  readonly variant?: ToastVariant;

  /**
   * Visibility.
   */
  readonly open: boolean;

  /**
   * Close callback.
   */
  readonly onClose: () => void;

  /**
   * Optional action.
   */
  readonly action?: ReactNode;
}

/**
 * Returns icon.
 *
 * @param variant Toast variant.
 * @returns Icon.
 */
function getIcon(
  variant: ToastVariant,
): React.JSX.Element {
  switch (variant) {
    case "success":
      return (
        <CheckCircle2
          className="text-green-600"
          size={22}
        />
      );

    case "error":
      return (
        <XCircle
          className="text-red-600"
          size={22}
        />
      );

    case "warning":
      return (
        <CircleAlert
          className="text-yellow-600"
          size={22}
        />
      );

    default:
      return (
        <Info
          className="text-blue-600"
          size={22}
        />
      );
  }
}

/**
 * Toast component.
 *
 * @param props Component properties.
 * @returns Toast.
 */
export function Toast({
  title,
  description,
  variant = "info",
  open,
  onClose,
  action,
}: ToastProps): React.JSX.Element {
  if (!open) {
    return <></>;
  }

  return (
    <div className="fixed right-6 top-6 z-50 w-full max-w-sm rounded-lg border border-slate-200 bg-white shadow-xl">
      <div className="flex items-start gap-4 p-4">
        {getIcon(variant)}

        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          {description ? (
            <p className="mt-1 text-sm text-slate-600">
              {description}
            </p>
          ) : null}

          {action ? (
            <div className="mt-3">
              {action}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 transition hover:bg-slate-100"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}