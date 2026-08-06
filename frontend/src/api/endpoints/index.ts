/**
 * API endpoint definitions.
 *
 * Centralizes all backend endpoint paths used by
 * the frontend application.
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },

  ORGANIZATIONS: {
    BASE: "/organizations",
  },

  TEAMS: {
    BASE: "/teams",
  },

  USERS: {
    BASE: "/users",
  },

  PROJECTS: {
    BASE: "/projects",
  },

  CUSTOMERS: {
    BASE: "/customers",
  },

  TICKETS: {
    BASE: "/tickets",
  },

  COMMENTS: {
    BASE: "/comments",
  },

  ATTACHMENTS: {
    BASE: "/attachments",
  },

  NOTIFICATIONS: {
    BASE: "/notifications",
  },

  ANALYTICS: {
    BASE: "/analytics",
  },

  WORKFLOWS: {
    BASE: "/workflows",
  },

  SLA: {
    BASE: "/sla",
  },

  AI: {
    CHAT: "/ai/chat",
    KNOWLEDGE: "/ai/knowledge",
    DOCUMENTS: "/ai/documents",
    INGESTION: "/ai/ingestion",
    RETRIEVAL: "/ai/retrieval",
  },
} as const;