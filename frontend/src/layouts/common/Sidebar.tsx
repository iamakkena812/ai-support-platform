/**
 * Sidebar component.
 *
 * Main application navigation.
 */

import type { ComponentType } from "react";

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
import { NavLink } from "react-router-dom";

import { PROTECTED_ROUTES } from "../../app/routing/route-config";

interface NavigationItem {
  readonly label: string;
  readonly path: string;
  readonly icon: ComponentType<{
    readonly className?: string;
  }>;
}

interface NavigationSection {
  readonly title: string;
  readonly items: readonly NavigationItem[];
}

const navigationSections: readonly NavigationSection[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        path: PROTECTED_ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        label: "Organizations",
        path: PROTECTED_ROUTES.ORGANIZATIONS,
        icon: Building2,
      },
      {
        label: "Customers",
        path: PROTECTED_ROUTES.CUSTOMERS,
        icon: Users,
      },
      {
        label: "Tickets",
        path: PROTECTED_ROUTES.TICKETS,
        icon: Ticket,
      },
      {
        label: "Projects",
        path: PROTECTED_ROUTES.PROJECTS,
        icon: FolderKanban,
      },
      {
        label: "Teams",
        path: PROTECTED_ROUTES.TEAMS,
        icon: Shield,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        label: "Comments",
        path: PROTECTED_ROUTES.COMMENTS,
        icon: MessageSquare,
      },
      {
        label: "Attachments",
        path: PROTECTED_ROUTES.ATTACHMENTS,
        icon: Paperclip,
      },
      {
        label: "Notifications",
        path: PROTECTED_ROUTES.NOTIFICATIONS,
        icon: Bell,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Users",
        path: PROTECTED_ROUTES.USERS,
        icon: UserRound,
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
    ],
  },
  {
    title: "AI & Insights",
    items: [
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
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        path: PROTECTED_ROUTES.SETTINGS,
        icon: Settings,
      },
    ],
  },
];

function navigationClassName({
  isActive,
}: {
  readonly isActive: boolean;
}): string {
  return [
    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
    "transition-colors",
    isActive
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");
}

/**
 * Sidebar component.
 *
 * @returns Sidebar component.
 */
export function Sidebar(): React.JSX.Element {
  return (
    <aside className="flex h-full w-full flex-col bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="truncate text-sm font-semibold text-slate-900">
          Enterprise AI
        </div>

        <div className="truncate text-xs text-slate-500">
          Support Platform
        </div>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-4"
        aria-label="Main navigation"
      >
        <div className="space-y-6">
          {navigationSections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </h2>

              <ul className="space-y-1">
                {section.items.map(
                  ({ label, path, icon: Icon }) => (
                    <li key={path}>
                      <NavLink
                        to={path}
                        end={
                          path === PROTECTED_ROUTES.DASHBOARD
                        }
                        className={navigationClassName}
                      >
                        <Icon className="h-4 w-4 shrink-0" />

                        <span className="truncate">
                          {label}
                        </span>
                      </NavLink>
                    </li>
                  ),
                )}
              </ul>
            </section>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-200 px-5 py-3">
        <div className="text-xs text-slate-500">
          Version 1.0.0
        </div>
      </div>
    </aside>
  );
}