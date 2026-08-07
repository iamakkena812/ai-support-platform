/**
 * Edit user page.
 *
 * Provides user update functionality.
 */

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  UserForm,
} from "../components/UserForm";

import {
  useUser,
  useUpdateUser,
} from "../hooks/useUser";

import type {
  UpdateUserRequest,
} from "../types/user.types";


/**
 * Edit user page.
 *
 * @returns Edit user page component.
 */
export function EditUserPage(): React.JSX.Element {

  const {
    id = "",
  } =
    useParams<{
      id: string;
    }>();


  const navigate =
    useNavigate();


  const {
    data: user,
    isLoading,
  } =
    useUser(id);


  const {
    mutateAsync:
      updateUser,
    isPending,
  } =
    useUpdateUser();


  async function handleSubmit(
    values: UpdateUserRequest,
  ): Promise<void> {

    await updateUser(
      {
        id,
        payload: values,
      },
    );

    navigate(
      `/users/${id}`,
    );
  }


  if (isLoading) {
    return (
      <div>
        Loading user...
      </div>
    );
  }


  if (!user) {
    return (
      <div>
        User not found.
      </div>
    );
  }


  return (
    <div className="space-y-6">

      <header>
        <h1
          className="text-2xl font-bold text-slate-900"
        >
          Edit User
        </h1>

        <p
          className="mt-1 text-sm text-slate-600"
        >
          Update user information.
        </p>
      </header>


      <UserForm
        initialValue={
          user
        }
        onSubmit={
          handleSubmit
        }
        isSubmitting={
          isPending
        }
      />

    </div>
  );
}