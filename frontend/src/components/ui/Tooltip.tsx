/**
 * Tooltip component.
 *
 * Displays helper text when hovering over an element.
 */

import type {
  PropsWithChildren,
  ReactNode,
} from "react";

/**
 * Component properties.
 */
export interface TooltipProps
  extends PropsWithChildren {
  /**
   * Tooltip content.
   */
  readonly content: ReactNode;
}

/**
 * Tooltip component.
 *
 * @param props Component properties.
 * @returns Tooltip component.
 */
export function Tooltip({
  children,
  content,
}: TooltipProps): React.JSX.Element {
  return (
    <div className="group relative inline-flex">
      {children}

      <div
        className="
          pointer-events-none
          absolute
          bottom-full
          left-1/2
          z-50
          mb-2
          hidden
          -translate-x-1/2
          whitespace-nowrap
          rounded-lg
          bg-slate-900
          px-3
          py-2
          text-xs
          text-white
          shadow-lg
          group-hover:block
        "
      >
        {content}

        <div
          className="
            absolute
            left-1/2
            top-full
            h-2
            w-2
            -translate-x-1/2
            -translate-y-1
            rotate-45
            bg-slate-900
          "
        />
      </div>
    </div>
  );
}