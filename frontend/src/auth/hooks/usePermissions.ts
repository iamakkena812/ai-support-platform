/**
 * Permission authorization hook.
 *
 * Provides reusable permission checks for routes,
 * navigation, and UI actions.
 */

import {
  PERMISSIONS_BY_RESOURCE,
  READ_PERMISSIONS,
} from "../../config/permissions";

import type {
  Permission,
  PermissionResource,
} from "../../shared/enums/permissions";

/**
 * Permission collection.
 */
export type PermissionCollection = readonly Permission[];

/**
 * Permission authorization helpers.
 */
export interface PermissionAuthorization {
  /**
   * Permissions available to the current user.
   */
  readonly permissions: PermissionCollection;

  /**
   * Checks whether the current user has a permission.
   *
   * @param permission - Permission to check.
   * @returns True when the permission is available.
   */
  readonly hasPermission: (
    permission: Permission,
  ) => boolean;

  /**
   * Checks whether the current user has at least
   * one of the supplied permissions.
   *
   * @param permissions - Permissions to check.
   * @returns True when at least one permission is available.
   */
  readonly hasAnyPermission: (
    permissions: readonly Permission[],
  ) => boolean;

  /**
   * Checks whether the current user has every
   * supplied permission.
   *
   * @param permissions - Permissions to check.
   * @returns True when all permissions are available.
   */
  readonly hasAllPermissions: (
    permissions: readonly Permission[],
  ) => boolean;

  /**
   * Checks whether the current user has any permission
   * for the specified resource.
   *
   * @param resource - Resource to check.
   * @returns True when access exists for the resource.
   */
  readonly hasResourcePermission: (
    resource: PermissionResource,
  ) => boolean;

  /**
   * Checks whether the current user can read at least
   * one resource.
   *
   * @returns True when at least one read permission exists.
   */
  readonly canRead: () => boolean;
}

/**
 * Creates permission authorization helpers.
 *
 * This hook accepts permissions explicitly because the
 * authentication response currently exposes roles rather
 * than resolved permissions.
 *
 * Permission resolution from roles can be connected when
 * the frontend role/permission API integration is available.
 *
 * @param permissions - Permissions available to the user.
 * @returns Permission authorization helpers.
 */
export function usePermissions(
  permissions: PermissionCollection = [],
): PermissionAuthorization {
  const permissionSet = new Set(permissions);

  /**
   * Checks one permission.
   */
  const hasPermission = (
    permission: Permission,
  ): boolean => {
    return permissionSet.has(permission);
  };

  /**
   * Checks whether at least one permission exists.
   */
  const hasAnyPermission = (
    requestedPermissions: readonly Permission[],
  ): boolean => {
    return requestedPermissions.some(
      (permission) => permissionSet.has(permission),
    );
  };

  /**
   * Checks whether every permission exists.
   */
  const hasAllPermissions = (
    requestedPermissions: readonly Permission[],
  ): boolean => {
    return requestedPermissions.every(
      (permission) => permissionSet.has(permission),
    );
  };

  /**
   * Checks whether the user has any permission
   * for a resource.
   */
  const hasResourcePermission = (
    resource: PermissionResource,
  ): boolean => {
    return PERMISSIONS_BY_RESOURCE[resource].some(
      (definition) =>
        permissionSet.has(definition.code),
    );
  };

  /**
   * Checks whether the user has at least one read permission.
   */
  const canRead = (): boolean => {
    return READ_PERMISSIONS.some(
      (permission) => permissionSet.has(permission),
    );
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasResourcePermission,
    canRead,
  };
}