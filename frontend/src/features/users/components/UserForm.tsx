/**
 * User form component.
 *
 * Provides reusable form UI for creating
 * and updating users.
 */

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  createUserSchema,
} from "../schemas/user.schema";

import type {
  User,
  CreateUserRequest,
} from "../types/user.types";


/**
 * User form values.
 */
export type UserFormValues =
  CreateUserRequest;


/**
 * User form props.
 */
interface UserFormProps {

  /**
   * Initial user values.
   */
  readonly initialValue?: User;


  /**
   * Submit handler.
   */
  readonly onSubmit: (
    values: UserFormValues,
  ) => Promise<void>;


  /**
   * Loading state.
   */
  readonly isSubmitting?: boolean;
}


/**
 * User form component.
 */
export function UserForm(
  {
    initialValue,
    onSubmit,
    isSubmitting = false,
  }: UserFormProps,
): React.JSX.Element {

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } =
    useForm<CreateUserRequest>({
      resolver:
        zodResolver(
          createUserSchema,
        ),

      defaultValues:
      {
        organizationId:
          initialValue
            ?.organization
            ?.id ?? "",

        firstName:
          initialValue
            ?.firstName ?? "",

        lastName:
          initialValue
            ?.lastName ?? "",

        email:
          initialValue
            ?.email ?? "",

        password:
          "",

        roleIds:
          initialValue
            ?.roles
            ?.map(
              (role) =>
                role.id,
            ) ?? [],
      },
    });


  return (
    <form
      onSubmit={
        handleSubmit(
          onSubmit,
        )
      }
      className="space-y-6"
    >

      <div>
        <label className="block text-sm font-medium">
          First Name
        </label>

        <input
          {...register(
            "firstName",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
        />

        {
          errors.firstName && (
            <p className="text-sm text-red-600">
              {
                errors.firstName.message
              }
            </p>
          )
        }
      </div>


      <div>
        <label className="block text-sm font-medium">
          Last Name
        </label>

        <input
          {...register(
            "lastName",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
        />

        {
          errors.lastName && (
            <p className="text-sm text-red-600">
              {
                errors.lastName.message
              }
            </p>
          )
        }
      </div>


      <div>
        <label className="block text-sm font-medium">
          Email
        </label>

        <input
          type="email"
          {...register(
            "email",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>


      {
        !initialValue && (
          <div>
            <label className="block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              {...register(
                "password",
              )}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
        )
      }


      <div>
        <label className="block text-sm font-medium">
          Organization Id
        </label>

        <input
          {...register(
            "organizationId",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>


      <button
        type="submit"
        disabled={
          isSubmitting
        }
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {
          isSubmitting
            ? "Saving..."
            : "Save User"
        }
      </button>

    </form>
  );
}