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

import { useDeleteRole } from "../hooks/useRole";
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

  const deleteRole = useDeleteRole();



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


            isSystem:
              role.isSystem ?? false,

          }),
        ),

      [
        roles,
      ],
    );

  async function handleDelete(id: string): Promise<void> {
    await deleteRole.mutateAsync(id);
  }



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
            total={statistics.total}
            system={statistics.system}
            custom={statistics.custom}
            assigned={statistics.assigned}
            unassigned={statistics.unassigned}
          />

        ) : null
      }

      {deleteRole.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to delete role. Please try again.
        </div>
      )}



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

            onDelete={(id) => {
              void handleDelete(id);
            }}

          />

        )

      }


    </div>

  );

}
