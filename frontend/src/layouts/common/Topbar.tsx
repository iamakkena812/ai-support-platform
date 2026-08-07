/**
 * Topbar component.
 *
 * Displays the application actions.
 */

import {
  Bell,
  Moon,
  Search,
  Sun,
  UserCircle,
} from "lucide-react";

import { useTheme } from "../../app/providers/theme";

/**
 * Topbar component.
 *
 * @returns Topbar component.
 */
export function Topbar(): React.JSX.Element {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  return (
    <div className="flex items-center gap-4">
      {/* Search */}

      <div className="relative hidden lg:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="search"
          placeholder="Search..."
          className="w-72 rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500"
        />
      </div>

      {/* Theme */}

      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-lg p-2 transition hover:bg-slate-100"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-slate-600" />
        ) : (
          <Sun className="h-5 w-5 text-slate-600" />
        )}
      </button>

      {/* Notifications */}

      <button
        type="button"
        className="relative rounded-lg p-2 transition hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-slate-600" />

        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
      </button>

      {/* User */}

      <button
        type="button"
        className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-slate-100"
      >
        <UserCircle className="h-8 w-8 text-slate-600" />

        <div className="hidden text-left md:block">
          <div className="text-sm font-medium text-slate-900">
            Administrator
          </div>

          <div className="text-xs text-slate-500">
            admin@example.com
          </div>
        </div>
      </button>
    </div>
  );
}