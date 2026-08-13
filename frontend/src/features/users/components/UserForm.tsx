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
  userFormSchema,
} from "../schemas/user.schema";

import type {
  User,
} from "../types/user.types";


/**
 * User form values.
 *
 * Contains all fields used by create and update modes.
 */
export interface UserFormValues {
  organizationId?: string;

  username: string;

  fullName: string;

  email: string;

  password?: string;

  isActive?: boolean;

  isSuperuser?: boolean;
}


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
    useForm<UserFormValues>({
      resolver:
        zodResolver(
          userFormSchema,
        ),

      defaultValues: {
        organizationId:
          initialValue
            ?.organizationId ?? "",

        username:
          initialValue
            ?.username ?? "",

        fullName:
          initialValue
            ?.fullName ?? "",

        email:
          initialValue
            ?.email ?? "",

        password: "",

        isActive:
          initialValue
            ?.isActive ?? true,

        isSuperuser:
          initialValue
            ?.isSuperuser ?? false,
      },
    });


  /**
   * Handles create and update submission.
   */
  const handleFormSubmit = async (
    values: UserFormValues,
  ): Promise<void> => {

    await onSubmit(values);
  };


  return (
    <form
      onSubmit={
        handleSubmit(
          handleFormSubmit,
        )
      }
      className="space-y-6"
    >

      <div>
        <label className="block text-sm font-medium">
          Full Name
        </label>

        <input
          {...register(
            "fullName",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
        />

        {
          errors.fullName && (
            <p className="text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )
        }
      </div>


      <div>
        <label className="block text-sm font-medium">
          Username
        </label>

        <input
          {...register(
            "username",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
        />

        {
          errors.username && (
            <p className="text-sm text-red-600">
              {errors.username.message}
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

        {
          errors.email && (
            <p className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )
        }
      </div>


      {
        !initialValue && (
          <>
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

              {
                errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )
              }
            </div>


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

              {
                errors.organizationId && (
                  <p className="text-sm text-red-600">
                    {errors.organizationId.message}
                  </p>
                )
              }
            </div>
          </>
        )
      }


      <div className="flex items-center gap-2">

        <input
          type="checkbox"
          id="isActive"
          {...register(
            "isActive",
          )}
          className="h-4 w-4 rounded border-slate-300"
        />

        <label
          htmlFor="isActive"
          className="text-sm font-medium"
        >
          Active
        </label>

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