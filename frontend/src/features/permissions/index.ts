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
  PermissionHeader,
  PermissionSkeleton,
  PermissionStats,
  PermissionStatusBadge,
  PermissionSummary,
  PermissionTable,
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
  usePermissionStatistics,
} from "./hooks/usePermissions";

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
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionFilterValues,
  PermissionListQuery,
  PermissionListResponse,
  PermissionStatistics,
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
