/**
 * Navigation item component.
 *
 * Displays a reusable navigation link.
 */

import type {
  ReactNode,
} from "react";

import {
  NavLink,
} from "react-router-dom";

/**
 * Component properties.
 */
export interface NavItemProps {
  /**
   * Navigation label.
   */
  readonly label: string;

  /**
   * Navigation route.
   */
  readonly to: string;

  /**
   * Navigation icon.
   */
  readonly icon?: ReactNode;

  /**
   * Badge content.
   */
  readonly badge?: ReactNode;

  /**
   * Disabled state.
   */
  readonly disabled?: boolean;
}

/**
 * Navigation item.
 *
 * @param props Component properties.
 * @returns Navigation item component.
 */
export function NavItem({
  label,
  to,
  icon,
  badge,
  disabled = false,
}: NavItemProps): React.JSX.Element {
  if (disabled) {
    return (
      <div className="flex cursor-not-allowed items-center justify-between rounded-lg px-4 py-3 text-slate-400 opacity-60">
        <div className="flex items-center gap-3">
          {icon}

          <span>{label}</span>
        </div>

        {badge}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        ].join(" ")
      }
    >
      <div className="flex items-center gap-3">
        {icon}

        <span>{label}</span>
      </div>

      {badge}
    </NavLink>
  );
}