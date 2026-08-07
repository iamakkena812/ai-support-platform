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
  Settings,
  Shield,
  Ticket,
  UserRound,
  Users,
  Paperclip,
} from "lucide-react";

/**
 * Navigation item.
 */
interface NavigationItem {
  readonly label: string;
  readonly path: string;
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
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Organizations",
    path: "/organizations",
    icon: Building2,
  },
  {
    label: "Teams",
    path: "/teams",
    icon: Shield,
  },
  {
    label: "Users",
    path: "/users",
    icon: UserRound,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Tickets",
    path: "/tickets",
    icon: Ticket,
  },
  {
    label: "Comments",
    path: "/comments",
    icon: MessageSquare,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    label: "Knowledge Base",
    path: "/knowledge-base",
    icon: BookOpen,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: Gauge,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    label: "Attachments",
    path: "/attachments",
    icon: Paperclip,
  },
];

/**
 * Sidebar component.
 *
 * @returns Sidebar component.
 */
export function Sidebar(): React.JSX.Element {
  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-slate-900">
          AI Support Platform
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Enterprise Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
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
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5" />

                  <span>{label}</span>
                </NavLink>
              </li>
            ),
          )}
        </ul>
      </nav>

      {/* Footer */}
      <footer>
        <p className="mt-6 text-center text-xs text-slate-400">
          Version 1.0.0
        </p>
      </footer>
    </aside>
  );
}