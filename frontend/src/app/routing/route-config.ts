/**
 * Application route configuration.
 *
 * Defines all application routes and their metadata.
 */

export interface AppRoute {
  /**
   * Route display name.
   */
  readonly name: string;

  /**
   * URL path.
   */
  readonly path: string;

  /**
   * Whether authentication is required.
   */
  readonly protected: boolean;

  /**
   * Optional permission required to access the route.
   */
  readonly permission?: string;
}

/**
 * Public application routes.
 */
export const PUBLIC_ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

/**
 * Protected application routes.
 */
export const PROTECTED_ROUTES = {
  DASHBOARD: "/",

  ORGANIZATIONS: "/organizations",

  TEAMS: "/teams",

  USERS: "/users",

  PROJECTS: "/projects",

  CUSTOMERS: "/customers",

  TICKETS: "/tickets",

  COMMENTS: "/comments",

  ATTACHMENTS: "/attachments",

  NOTIFICATIONS: "/notifications",

  ANALYTICS: "/analytics",

  WORKFLOWS: "/workflows",

  SLA: "/sla",

  AI_CHAT: "/ai/chat",

  AI_DOCUMENTS: "/ai/documents",

  AI_KNOWLEDGE: "/ai/knowledge",

  AI_RETRIEVAL: "/ai/retrieval",
} as const;

/**
 * Complete application route definitions.
 */
export const APP_ROUTES: readonly AppRoute[] = [
  {
    name: "Login",
    path: PUBLIC_ROUTES.LOGIN,
    protected: false,
  },
  {
    name: "Forgot Password",
    path: PUBLIC_ROUTES.FORGOT_PASSWORD,
    protected: false,
  },
  {
    name: "Reset Password",
    path: PUBLIC_ROUTES.RESET_PASSWORD,
    protected: false,
  },

  {
    name: "Dashboard",
    path: PROTECTED_ROUTES.DASHBOARD,
    protected: true,
  },

  {
    name: "Organizations",
    path: PROTECTED_ROUTES.ORGANIZATIONS,
    protected: true,
  },

  {
    name: "Teams",
    path: PROTECTED_ROUTES.TEAMS,
    protected: true,
  },

  {
    name: "Users",
    path: PROTECTED_ROUTES.USERS,
    protected: true,
  },

  {
    name: "Projects",
    path: PROTECTED_ROUTES.PROJECTS,
    protected: true,
  },

  {
    name: "Customers",
    path: PROTECTED_ROUTES.CUSTOMERS,
    protected: true,
  },

  {
    name: "Tickets",
    path: PROTECTED_ROUTES.TICKETS,
    protected: true,
  },

  {
    name: "Comments",
    path: PROTECTED_ROUTES.COMMENTS,
    protected: true,
  },

  {
    name: "Attachments",
    path: PROTECTED_ROUTES.ATTACHMENTS,
    protected: true,
  },

  {
    name: "Notifications",
    path: PROTECTED_ROUTES.NOTIFICATIONS,
    protected: true,
  },

  {
    name: "Analytics",
    path: PROTECTED_ROUTES.ANALYTICS,
    protected: true,
  },

  {
    name: "Workflows",
    path: PROTECTED_ROUTES.WORKFLOWS,
    protected: true,
  },

  {
    name: "SLA",
    path: PROTECTED_ROUTES.SLA,
    protected: true,
  },

  {
    name: "AI Chat",
    path: PROTECTED_ROUTES.AI_CHAT,
    protected: true,
  },

  {
    name: "AI Documents",
    path: PROTECTED_ROUTES.AI_DOCUMENTS,
    protected: true,
  },

  {
    name: "AI Knowledge",
    path: PROTECTED_ROUTES.AI_KNOWLEDGE,
    protected: true,
  },

  {
    name: "AI Retrieval",
    path: PROTECTED_ROUTES.AI_RETRIEVAL,
    protected: true,
  },
] as const;