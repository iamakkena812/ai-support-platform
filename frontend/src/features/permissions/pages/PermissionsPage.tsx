/**
 * Permissions page.
 *
 * Displays the permission management workspace including
 * statistics, filters, and the permission list.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PermissionActions,
  PermissionEmpty,
  PermissionError,
  PermissionFilters,
  PermissionHeader,
  PermissionStats,
  PermissionTable,
} from "../components";

import {
  usePermissionStatistics,
  usePermissions,
} from "../hooks/usePermissions";

import type {
  PermissionFilterValues,
} from "../types/permission.types";

/**
 * Permissions page.
 *
 * @returns Permissions management page.
 */
export function PermissionsPage() {
  const navigate = useNavigate();

  const [filters, setFilters] =
    useState<PermissionFilterValues>({});

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = usePermissions({
    filters,
  });

  const {
    data: statistics,
    isLoading: isStatisticsLoading,
  } = usePermissionStatistics();

  const permissions = data?.items ?? [];

  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.resource) ||
    Boolean(filters.action);

  const handleClearFilters = (): void => {
    setFilters({});
  };

  const handleSelectPermission = (
    permission: {
      readonly id: string;
    },
  ): void => {
    navigate(`/permissions/${permission.id}`);
  };

  const handleRefresh = (): void => {
    void refetch();
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Unable to load permissions. Please try again.";

  return (
    <div className="space-y-6">
      <PermissionHeader
        actions={
          <PermissionActions
            canCreate
            onRefresh={handleRefresh}
          />
        }
      />

      <PermissionStats
        statistics={statistics ?? null}
        isLoading={isStatisticsLoading}
      />

      <PermissionFilters
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
      />

      {isError ? (
        <PermissionError
          message={errorMessage}
          onRetry={handleRefresh}
        />
      ) : (
        <>
          {!isLoading &&
            permissions.length === 0 ? (
            <PermissionEmpty
              hasFilters={hasFilters}
              canCreate
              onClearFilters={
                hasFilters
                  ? handleClearFilters
                  : undefined
              }
            />
          ) : (
            <PermissionTable
              permissions={permissions}
              isLoading={isLoading}
              onSelect={handleSelectPermission}
            />
          )}
        </>
      )}
    </div>
  );
}
