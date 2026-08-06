/**
 * Organization form component.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  createOrganizationSchema,
} from "../schemas/organization.schema";

import type {
  CreateOrganizationRequest,
  Organization,
} from "../types/organization.types";

export interface OrganizationFormProps {
  /**
   * Initial organization.
   */
  readonly initialValues?: Organization;

  /**
   * Submit callback.
   */
  readonly onSubmit: (
    values: CreateOrganizationRequest,
  ) => Promise<void> | void;

  /**
   * Loading state.
   */
  readonly isLoading?: boolean;
}

/**
 * Organization form.
 */
export function OrganizationForm({
  initialValues,
  onSubmit,
  isLoading = false,
}: OrganizationFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<CreateOrganizationRequest>({
    resolver: zodResolver(
      createOrganizationSchema,
    ),

    defaultValues: {
      name: initialValues?.name ?? "",

      description:
        initialValues?.description ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Organization Name
        </label>

        <input
          {...register("name")}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        {errors.name && (
          <p className="mt-2 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          {...register("description")}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        {errors.description && (
          <p className="mt-2 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading
          ? "Saving..."
          : "Save Organization"}
      </button>
    </form>
  );
}