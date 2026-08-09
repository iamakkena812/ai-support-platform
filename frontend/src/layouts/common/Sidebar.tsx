/**
 * Sidebar component.
 *
 * Main application navigation.
 */

import type { ComponentType } from "react";

import { NavLink } from "react-router-dom";

import {
  Bell,
  BookOpen,
  Building2,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  MessageSquare,
  Paperclip,
  Settings,
  Shield,
  ShieldCheck,
  Ticket,
  UserRound,
  Users,
} from "lucide-react";

import { PROTECTED_ROUTES } from "../../app/routing/route-config";

/**
 * Navigation item.
 */
interface NavigationItem {
  /**
   * Navigation label.
   */
  readonly label: string;

  /**
   * Navigation path.
   */
  readonly path: string;

  /**
   * Navigation icon.
   */
  readonly icon: ComponentType<{
    readonly className?: string;
  }>;
}

/**
 * Sidebar navigation.
 */
const navigation: readonly NavigationItem[] = [
  {
    label: "Dashboard",
    path: PROTECTED_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Organizations",
    path: PROTECTED_ROUTES.ORGANIZATIONS,
    icon: Building2,
  },
  {
    label: "Teams",
    path: PROTECTED_ROUTES.TEAMS,
    icon: Shield,
  },
  {
    label: "Users",
    path: PROTECTED_ROUTES.USERS,
    icon: UserRound,
  },
  {
    label: "Customers",
    path: PROTECTED_ROUTES.CUSTOMERS,
    icon: Users,
  },
  {
    label: "Projects",
    path: PROTECTED_ROUTES.PROJECTS,
    icon: FolderKanban,
  },
  {
    label: "Tickets",
    path: PROTECTED_ROUTES.TICKETS,
    icon: Ticket,
  },
  {
    label: "Comments",
    path: PROTECTED_ROUTES.COMMENTS,
    icon: MessageSquare,
  },
  {
    label: "Notifications",
    path: PROTECTED_ROUTES.NOTIFICATIONS,
    icon: Bell,
  },
  {
    label: "Knowledge Base",
    path: PROTECTED_ROUTES.AI_KNOWLEDGE,
    icon: BookOpen,
  },
  {
    label: "Reports",
    path: PROTECTED_ROUTES.ANALYTICS,
    icon: Gauge,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    label: "Attachments",
    path: PROTECTED_ROUTES.ATTACHMENTS,
    icon: Paperclip,
  },
  {
    label: "Roles",
    path: PROTECTED_ROUTES.ROLES,
    icon: ShieldCheck,
  },
  {
    label: "Permissions",
    path: PROTECTED_ROUTES.PERMISSIONS,
    icon: ShieldCheck,
  },
];

/**
 * Sidebar component.
 *
 * @returns Sidebar component.
 */
export function Sidebar(): React.JSX.Element {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">
        <h1 className="text-lg font-semibold text-slate-900">
          Enterprise AI
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Enterprise Platform
        </p>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4"
        aria-label="Main navigation"
      >
        <ul className="space-y-1">
          {navigation.map(
            ({
              label,
              path,
              icon: Icon,
            }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />

                  <span>{label}</span>
                </NavLink>
              </li>
            ),
          )}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 px-5 py-3">
        <p className="text-xs text-slate-400">
          Enterprise AI Support Platform
        </p>
      </div>
    </aside>
  );
}
