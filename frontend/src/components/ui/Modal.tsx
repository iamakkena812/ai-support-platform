/**
 * Modal component.
 *
 * Displays reusable modal dialogs.
 */

import type {
  PropsWithChildren,
  ReactNode,
} from "react";

import { X } from "lucide-react";

/**
 * Component properties.
 */
export interface ModalProps
  extends PropsWithChildren {
  /**
   * Dialog visibility.
   */
  readonly open: boolean;

  /**
   * Dialog title.
   */
  readonly title: string;

  /**
   * Optional dialog description.
   */
  readonly description?: string;

  /**
   * Footer content.
   */
  readonly footer?: ReactNode;

  /**
   * Close callback.
   */
  readonly onClose: () => void;
}

/**
 * Modal component.
 *
 * @param props Component properties.
 * @returns Modal component.
 */
export function Modal({
  open,
  title,
  description,
  footer,
  children,
  onClose,
}: ModalProps): React.JSX.Element {
  if (!open) {
    return <></>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        {/* Header */}

        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {title}
            </h2>

            {description ? (
              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>

        {/* Body */}

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}

        {footer ? (
          <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}