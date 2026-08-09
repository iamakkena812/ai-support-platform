/**
 * Frontend RBAC permission configuration.
 *
 * Permission metadata mirrors the backend RBAC definitions
 * from app/rbac/permissions.py.
 */

import {
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
  PERMISSIONS,
  type Permission,
  type PermissionAction,
  type PermissionCode,
  type PermissionResource,
} from "../shared/enums/permissions";

/**
 * Permission definition.
 */
export interface PermissionDefinition {
  /**
   * Permission code.
   */
  readonly code: Permission;

  /**
   * Permission resource.
   */
  readonly resource: PermissionResource;

  /**
   * Permission action.
   */
  readonly action: PermissionAction;

  /**
   * Display label.
   */
  readonly label: string;

  /**
   * Permission description.
   */
  readonly description: string;
}

/**
 * Human-readable resource labels.
 */
const RESOURCE_LABELS: Record<PermissionResource, string> = {
  user: "Users",
  role: "Roles",
  permission: "Permissions",
  organization: "Organizations",
  ticket: "Tickets",
  knowledge: "Knowledge Base",
  ai: "AI",
};

/**
 * Human-readable action labels.
 */
const ACTION_LABELS: Record<PermissionAction, string> = {
  create: "Create",
  read: "View",
  update: "Update",
  delete: "Delete",
  assign: "Assign",
  close: "Close",
  chat: "Chat",
  generate: "Generate",
  evaluate: "Evaluate",
};

/**
 * Action descriptions.
 */
const ACTION_DESCRIPTIONS: Record<PermissionAction, string> = {
  create: "Create new resources.",
  read: "View and access resources.",
  update: "Update existing resources.",
  delete: "Delete resources.",
  assign: "Assign resources.",
  close: "Close resources.",
  chat: "Use AI chat capabilities.",
  generate: "Generate AI content.",
  evaluate: "Evaluate AI output.",
};

/**
 * Permission entries.
 */
const PERMISSION_ENTRIES = Object.entries(
  PERMISSIONS,
) as Array<[string, Permission]>;

/**
 * Creates a permission definition from a permission code.
 *
 * @param permission - Permission code.
 * @returns Permission definition.
 */
const createPermissionDefinition = (
  permission: Permission,
): PermissionDefinition => {
  const [resource, action] = permission.split(":") as [
    PermissionResource,
    PermissionAction,
  ];

  return {
    code: permission,
    resource,
    action,
    label: `${RESOURCE_LABELS[resource]} - ${ACTION_LABELS[action]}`,
    description: `${ACTION_DESCRIPTIONS[action]} Resource: ${RESOURCE_LABELS[resource]}.`,
  };
};

/**
 * Complete permission definitions.
 */
export const PERMISSION_DEFINITIONS:
  readonly PermissionDefinition[] = PERMISSION_ENTRIES.map(
    ([, permission]) =>
      createPermissionDefinition(permission),
  );

/**
 * Permission definition lookup map.
 */
export const PERMISSION_DEFINITION_MAP: Readonly<
  Record<Permission, PermissionDefinition>
> = PERMISSION_DEFINITIONS.reduce(
  (definitions, definition) => {
    definitions[definition.code] = definition;

    return definitions;
  },
  {} as Record<Permission, PermissionDefinition>,
);

/**
 * Permissions grouped by resource.
 */
export const PERMISSIONS_BY_RESOURCE: Readonly<
  Record<
    PermissionResource,
    readonly PermissionDefinition[]
  >
> = PERMISSION_DEFINITIONS.reduce(
  (groups, definition) => {
    groups[definition.resource] = [
      ...groups[definition.resource],
      definition,
    ];

    return groups;
  },
  Object.values(PERMISSION_RESOURCES).reduce(
    (groups, resource) => {
      groups[resource] = [];

      return groups;
    },
    {} as Record<
      PermissionResource,
      PermissionDefinition[]
    >,
  ),
);

/**
 * Permissions grouped by action.
 */
export const PERMISSIONS_BY_ACTION: Readonly<
  Record<
    PermissionAction,
    readonly PermissionDefinition[]
  >
> = PERMISSION_DEFINITIONS.reduce(
  (groups, definition) => {
    groups[definition.action] = [
      ...groups[definition.action],
      definition,
    ];

    return groups;
  },
  Object.values(PERMISSION_ACTIONS).reduce(
    (groups, action) => {
      groups[action] = [];

      return groups;
    },
    {} as Record<
      PermissionAction,
      PermissionDefinition[]
    >,
  ),
);

/**
 * Permission codes grouped by resource.
 */
export const RESOURCE_PERMISSIONS: Readonly<
  Record<
    PermissionResource,
    readonly PermissionCode[]
  >
> = Object.values(PERMISSION_RESOURCES).reduce(
  (permissions, resource) => {
    permissions[resource] = PERMISSION_DEFINITIONS
      .filter(
        (definition) =>
          definition.resource === resource,
      )
      .map(
        (definition) => definition.code,
      );

    return permissions;
  },
  {} as Record<
    PermissionResource,
    PermissionCode[]
  >,
);

/**
 * Permission codes that create resources.
 */
export const CREATE_PERMISSIONS:
  readonly Permission[] =
  PERMISSION_DEFINITIONS
    .filter(
      (definition) =>
        definition.action ===
        PERMISSION_ACTIONS.CREATE,
    )
    .map(
      (definition) => definition.code,
    );

/**
 * Permission codes that read resources.
 */
export const READ_PERMISSIONS:
  readonly Permission[] =
  PERMISSION_DEFINITIONS
    .filter(
      (definition) =>
        definition.action ===
        PERMISSION_ACTIONS.READ,
    )
    .map(
      (definition) => definition.code,
    );

/**
 * Permission codes that update resources.
 */
export const UPDATE_PERMISSIONS:
  readonly Permission[] =
  PERMISSION_DEFINITIONS
    .filter(
      (definition) =>
        definition.action ===
        PERMISSION_ACTIONS.UPDATE,
    )
    .map(
      (definition) => definition.code,
    );

/**
 * Permission codes that delete resources.
 */
export const DELETE_PERMISSIONS:
  readonly Permission[] =
  PERMISSION_DEFINITIONS
    .filter(
      (definition) =>
        definition.action ===
        PERMISSION_ACTIONS.DELETE,
    )
    .map(
      (definition) => definition.code,
    );

/**
 * Permission codes that assign resources.
 */
export const ASSIGN_PERMISSIONS:
  readonly Permission[] =
  PERMISSION_DEFINITIONS
    .filter(
      (definition) =>
        definition.action ===
        PERMISSION_ACTIONS.ASSIGN,
    )
    .map(
      (definition) => definition.code,
    );

/**
 * Permission codes that close resources.
 */
export const CLOSE_PERMISSIONS:
  readonly Permission[] =
  PERMISSION_DEFINITIONS
    .filter(
      (definition) =>
        definition.action ===
        PERMISSION_ACTIONS.CLOSE,
    )
    .map(
      (definition) => definition.code,
    );

/**
 * Permission codes for AI chat.
 */
export const AI_CHAT_PERMISSIONS:
  readonly Permission[] = [
  PERMISSIONS.AI_CHAT,
];

/**
 * Permission codes for AI generation.
 */
export const AI_GENERATE_PERMISSIONS:
  readonly Permission[] = [
  PERMISSIONS.AI_GENERATE,
];

/**
 * Permission codes for AI evaluation.
 */
export const AI_EVALUATE_PERMISSIONS:
  readonly Permission[] = [
  PERMISSIONS.AI_EVALUATE,
];

/**
 * Checks whether a value is a valid permission.
 *
 * @param value - Value to check.
 * @returns True when the value is a permission.
 */
export const isPermission = (
  value: string,
): value is Permission => {
  return Object.values(PERMISSIONS).includes(
    value as Permission,
  );
};

/**
 * Gets a permission definition.
 *
 * @param permission - Permission code.
 * @returns Permission definition.
 */
export const getPermissionDefinition = (
  permission: Permission,
): PermissionDefinition => {
  return PERMISSION_DEFINITION_MAP[permission];
};

/**
 * Gets permissions for a resource.
 *
 * @param resource - Permission resource.
 * @returns Permission definitions.
 */
export const getPermissionsForResource = (
  resource: PermissionResource,
): readonly PermissionDefinition[] => {
  return PERMISSIONS_BY_RESOURCE[resource];
};

/**
 * Gets permissions for an action.
 *
 * @param action - Permission action.
 * @returns Permission definitions.
 */
export const getPermissionsForAction = (
  action: PermissionAction,
): readonly PermissionDefinition[] => {
  return PERMISSIONS_BY_ACTION[action];
};