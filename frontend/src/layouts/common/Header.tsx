/**
 * Header component.
 *
 * Displays the application header.
 */

import { Menu } from "lucide-react";

import { Topbar } from "./Topbar";

/**
 * Header component.
 *
 * @returns Header component.
 */
export function Header(): React.JSX.Element {
  return (
    <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-slate-900">
            Enterprise AI Support Platform
          </h1>

          <p className="hidden text-xs text-slate-500 sm:block">
            Customer Support Dashboard
          </p>
        </div>
      </div>

      <Topbar />
    </div>
  );
}