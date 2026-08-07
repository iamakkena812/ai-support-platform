/**
 * Roles page.
 *
 * Displays role listing,
 * filters, statistics, and actions.
 */

import {
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  RoleEmpty,
  RoleError,
  RoleHeader,
  RoleSkeleton,
  RoleStats,
  RoleTable,
} from "../components";

import {
  useRoles,
  useRoleStatistics,
} from "../hooks/useRoles";



/**
 * Roles page component.
 *
 * @returns Roles page.
 */
export function RolesPage(): React.JSX.Element {

  const navigate =
    useNavigate();



  const {
    data: rolesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } =
    useRoles();



  const {
    data: statistics,
  } =
    useRoleStatistics();



  const roles =
    useMemo(
      () =>
        rolesResponse?.items ?? [],
      [
        rolesResponse?.items,
      ],
    );



  const tableRows =
    useMemo(
      () =>
        roles.map(
          (
            role,
          ) => ({

            id:
              role.id,


            name:
              role.name,


            description:
              role.description ??
              undefined,


            permissionCount:
              0,


            userCount:
              0,


            status:
              role.status,


            isSystem:
              role.isSystem ?? false,

          }),
        ),

      [
        roles,
      ],
    );



  if (isLoading) {

    return (
      <RoleSkeleton />
    );

  }



  if (isError) {

    return (

      <RoleError

        error={
          error
        }

        onRetry={() => {

          void refetch();

        }}

      />

    );

  }



  return (

    <div

      className="space-y-6"

    >

      <RoleHeader

        actions={

          <button

            type="button"

            onClick={() =>
              navigate(
                "/roles/create",
              )
            }

            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"

          >

            Create Role

          </button>

        }

      />



      {
        statistics ? (

          <RoleStats

            totalRoles={
              statistics.total
            }


            activeRoles={
              statistics.active
            }


            inactiveRoles={
              statistics.inactive
            }


            systemRoles={
              0
            }


            totalPermissions={
              0
            }


            assignedUsers={
              0
            }

          />

        ) : null
      }



      {
        roles.length === 0 ? (

          <RoleEmpty

            onAction={() =>
              navigate(
                "/roles/create",
              )
            }

          />

        ) : (

          <RoleTable

            roles={
              tableRows
            }


            onView={
              (
                id,
              ) =>
                navigate(
                  `/roles/${id}`,
                )
            }


            onEdit={
              (
                id,
              ) =>
                navigate(
                  `/roles/${id}/edit`,
                )
            }

          />

        )

      }


    </div>

  );

}