/**
 * Edit role page.
 *
 * Provides UI for updating
 * an existing role.
 */

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  RoleError,
  RoleForm,
  RoleSkeleton,
} from "../components";

import {
  useRole,
  useUpdateRole,
} from "../hooks/useRole";

import type {
  UpdateRoleRequest,
} from "../types/role.types";



/**
 * Edit role page component.
 *
 * @returns Edit role page.
 */
export function EditRolePage(): React.JSX.Element {


  const {
    id = "",
  } =
    useParams<{
      id: string;
    }>();


  const navigate =
    useNavigate();



  const {
    data: role,
    isLoading,
    isError,
    error,
  } =
    useRole(
      id,
    );



  const {
    mutateAsync,
    isPending,
  } =
    useUpdateRole();



  async function handleSubmit(
    values: UpdateRoleRequest,
  ): Promise<void> {

    await mutateAsync(
      {
        id,
        payload:
          values,
      },
    );


    navigate(
      `/roles/${id}`,
    );

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

      />

    );

  }



  if (!role) {

    return (

      <RoleError

        error={
          new Error(
            "Role not found.",
          )
        }

      />

    );

  }



  return (

    <div
      className="space-y-6"
    >

      <header>

        <h1

          className="text-2xl font-bold text-slate-900"

        >

          Edit Role

        </h1>


        <p

          className="mt-1 text-sm text-slate-600"

        >

          Update role details and permissions.

        </p>


      </header>



      <section

        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"

      >

        <RoleForm

          initialValues={{

            name:
              role.name,


            description:
              role.description ??
              "",


            permissionIds:
              role.permissions?.map(
                (
                  permission,
                ) =>
                  permission.id,
              ) ?? [],

          }}


          permissions={
            role.permissions  ?? []
          }


          onSubmit={
            handleSubmit
          }


          isSubmitting={
            isPending
          }


          submitLabel="Update Role"

        />

      </section>


    </div>

  );

}