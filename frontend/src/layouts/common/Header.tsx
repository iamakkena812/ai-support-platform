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
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      {/* Left */}

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg p-2 transition hover:bg-slate-100"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Enterprise AI Support Platform
          </h1>

          <p className="text-sm text-slate-500">
            Customer Support Dashboard
          </p>
        </div>
      </div>

      {/* Right */}

      <Topbar />
    </header>
  );
}