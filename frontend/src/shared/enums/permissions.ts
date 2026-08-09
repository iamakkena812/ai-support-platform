/**
 * Frontend RBAC permission definitions.
 *
 * Permission codes mirror the backend RBAC permission
 * definitions in app/rbac/permissions.py.
 *
 * Permission codes follow the `resource:action` convention.
 */

export const PERMISSION_ACTIONS = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  ASSIGN: "assign",
  CLOSE: "close",
  CHAT: "chat",
  GENERATE: "generate",
  EVALUATE: "evaluate",
} as const;

export type PermissionAction =
  (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS];

export const PERMISSION_RESOURCES = {
  USER: "user",
  ROLE: "role",
  PERMISSION: "permission",
  ORGANIZATION: "organization",
  TICKET: "ticket",
  KNOWLEDGE: "knowledge",
  AI: "ai",
} as const;

export type PermissionResource =
  (typeof PERMISSION_RESOURCES)[keyof typeof PERMISSION_RESOURCES];

export type PermissionCode =
  `${PermissionResource}:${PermissionAction}`;

export const PERMISSIONS = {
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  ROLE_CREATE: "role:create",
  ROLE_READ: "role:read",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",
  ROLE_ASSIGN: "role:assign",

  PERMISSION_CREATE: "permission:create",
  PERMISSION_READ: "permission:read",
  PERMISSION_UPDATE: "permission:update",
  PERMISSION_DELETE: "permission:delete",

  ORGANIZATION_CREATE: "organization:create",
  ORGANIZATION_READ: "organization:read",
  ORGANIZATION_UPDATE: "organization:update",
  ORGANIZATION_DELETE: "organization:delete",

  TICKET_CREATE: "ticket:create",
  TICKET_READ: "ticket:read",
  TICKET_UPDATE: "ticket:update",
  TICKET_DELETE: "ticket:delete",
  TICKET_ASSIGN: "ticket:assign",
  TICKET_CLOSE: "ticket:close",

  KNOWLEDGE_CREATE: "knowledge:create",
  KNOWLEDGE_READ: "knowledge:read",
  KNOWLEDGE_UPDATE: "knowledge:update",
  KNOWLEDGE_DELETE: "knowledge:delete",

  AI_CHAT: "ai:chat",
  AI_GENERATE: "ai:generate",
  AI_EVALUATE: "ai:evaluate",
} as const satisfies Record<string, PermissionCode>;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];