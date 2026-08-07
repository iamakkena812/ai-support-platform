/**
 * User menu component.
 *
 * Displays the authenticated user's
 * profile menu.
 */

import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import {
  useState,
} from "react";

/**
 * Component properties.
 */
export interface UserMenuProps {
  /**
   * User display name.
   */
  readonly name: string;

  /**
   * User email.
   */
  readonly email: string;

  /**
   * Optional avatar URL.
   */
  readonly avatarUrl?: string;

  /**
   * Profile callback.
   */
  readonly onProfile: () => void;

  /**
   * Settings callback.
   */
  readonly onSettings: () => void;

  /**
   * Logout callback.
   */
  readonly onLogout: () => void;
}

/**
 * User menu.
 *
 * @param props Component properties.
 * @returns User menu component.
 */
export function UserMenu({
  name,
  email,
  avatarUrl,
  onProfile,
  onSettings,
  onLogout,
}: UserMenuProps): React.JSX.Element {
  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen(
            (previous) =>
              !previous,
          )
        }
        className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-100"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="hidden text-left md:block">
          <div className="text-sm font-semibold text-slate-900">
            {name}
          </div>

          <div className="text-xs text-slate-500">
            {email}
          </div>
        </div>

        <ChevronDown
          size={18}
          className={[
            "transition-transform",
            open
              ? "rotate-180"
              : "",
          ].join(" ")}
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onProfile();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-slate-100"
          >
            <User size={18} />

            Profile
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSettings();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-slate-100"
          >
            <Settings size={18} />

            Settings
          </button>

          <hr className="my-2 border-slate-200" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />

            Sign Out
          </button>
        </div>
      ) : null}
    </div>
  );
}