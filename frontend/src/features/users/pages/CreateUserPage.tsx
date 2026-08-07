/**
 * Create user page.
 *
 * Provides user creation functionality.
 */

import {
  useNavigate,
} from "react-router-dom";

import {
  UserForm,
} from "../components/UserForm";

import {
  useCreateUser,
} from "../hooks/useUsers";

import type {
  CreateUserRequest,
} from "../types/user.types";


/**
 * Create user page.
 *
 * @returns Create user page component.
 */
export function CreateUserPage(): React.JSX.Element {

  const navigate =
    useNavigate();


  const {
    mutateAsync:
      createUser,
    isPending,
  } =
    useCreateUser();


  /**
   * Handles user creation.
   *
   * @param values User creation payload.
   */
  async function handleSubmit(
    values: CreateUserRequest,
  ): Promise<void> {

    const user =
      await createUser(
        values,
      );


    navigate(
      `/users/${user.id}`,
    );
  }


  return (
    <div className="space-y-6">

      <header>
        <h1
          className="text-2xl font-bold text-slate-900"
        >
          Create User
        </h1>

        <p
          className="mt-1 text-sm text-slate-600"
        >
          Create a new platform user.
        </p>
      </header>


      <section
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >

        <UserForm
          onSubmit={
            handleSubmit
          }

          isSubmitting={
            isPending
          }
        />

      </section>

    </div>
  );
}