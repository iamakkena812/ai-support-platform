/**
 * Create role page.
 *
 * Provides UI for creating
 * a new role.
 */

import {
  useNavigate,
} from "react-router-dom";

import {
  RoleForm,
} from "../components";

import {
  useCreateRole,
} from "../hooks/useRoles";

import type {
  CreateRoleRequest,
} from "../types/role.types";



/**
 * Create role page component.
 *
 * @returns Create role page.
 */
export function CreateRolePage(): React.JSX.Element {


  const navigate =
    useNavigate();



  const {
    mutateAsync,
    isPending,
  } =
    useCreateRole();



  async function handleSubmit(
    values: CreateRoleRequest,
  ): Promise<void> {

    await mutateAsync(
      values,
    );


    navigate(
      "/roles",
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

          Create Role

        </h1>


        <p

          className="mt-1 text-sm text-slate-600"

        >

          Create a new role and assign permissions.

        </p>


      </header>



      <section

        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"

      >

        <RoleForm

          permissions={[]}

          onSubmit={
            handleSubmit
          }

          isSubmitting={
            isPending
          }

          submitLabel="Create Role"

        />

      </section>


    </div>

  );

}