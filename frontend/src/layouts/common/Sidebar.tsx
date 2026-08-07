/**
 * Sidebar component.
 *
 * Main application navigation.
 */

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
  Users,
} from "lucide-react";

/**
 * Navigation item.
 */
interface NavigationItem {
  readonly label: string;
  readonly path: string;
  readonly icon: React.ComponentType<{
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
    icon: Users,
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
];

/**
 * Sidebar component.
 *
 * @returns Sidebar component.
 */
export function Sidebar(): React.JSX.Element {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
      {/* Logo */}

      <div className="border-b border-slate-200 px-6 py-5">
        <h1 className="text-xl font-bold text-slate-900">
          AI Support
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Enterprise Platform
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
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

                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}

      <div className="border-t border-slate-200 px-4 py-4">
        <p className="text-center text-xs text-slate-500">
          Enterprise AI Support
        </p>

        <p className="mt-1 text-center text-xs text-slate-400">
          Version 1.0.0
        </p>
      </div>
    </aside>
  );
}