/**
 * Permissions feature.
 *
 * Public exports for the Permissions feature module.
 */

/**
 * API.
 */
export {
  PermissionApi,
} from "./api/permission.api";

/**
 * Components.
 */
export {
  DeletePermissionDialog,
  PermissionActions,
  PermissionCard,
  PermissionDetails,
  PermissionEmpty,
  PermissionError,
  PermissionFilters,
  PermissionForm,
  PermissionGroupCard,
  PermissionHeader,
  PermissionSkeleton,
  PermissionStats,
  PermissionStatusBadge,
  PermissionSummary,
  PermissionTable,
  PermissionTree,
  RolePermissionMatrix,
} from "./components";

/**
 * Hooks.
 */
export {
  usePermission,
  usePermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
  usePermissionGroups,
  usePermissionStatistics,
} from "./hooks/usePermissions";

export {
  useRolePermissions,
  useUpdateRolePermissions,
} from "./hooks/useRolePermissions";

/**
 * Services.
 */
export {
  PermissionService,
} from "./services/permission.service";

/**
 * Types.
 */
export type {
  Permission,
  PermissionGroup,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionFilterValues,
  PermissionListQuery,
  PermissionListResponse,
  PermissionGroupListResponse,
  PermissionStatistics,
  RolePermissionMapping,
  UpdateRolePermissionMappingRequest,
} from "./types/permission.types";

/**
 * Pages.
 */
export {
  PermissionsPage,
} from "./pages/PermissionsPage";

export {
  CreatePermissionPage,
} from "./pages/CreatePermissionPage";

export {
  EditPermissionPage,
} from "./pages/EditPermissionPage";

export {
  PermissionDetailsPage,
} from "./pages/PermissionDetailsPage";