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
      code: initialValues?.code ?? "",
      email: initialValues?.email ?? "",
      phone: initialValues?.phone ?? "",
      website: initialValues?.website ?? "",
      address: initialValues?.address ?? "",
      city: initialValues?.city ?? "",
      state: initialValues?.state ?? "",
      country: initialValues?.country ?? "",
      postalCode: initialValues?.postalCode ?? "",
      timezone: initialValues?.timezone ?? "UTC",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            Organization Code
          </label>

          <input
            {...register("code")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />

          {errors.code && (
            <p className="mt-2 text-sm text-red-600">
              {errors.code.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <input
            {...register("phone")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Website
          </label>

          <input
            {...register("website")}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />

          {errors.website && (
            <p className="mt-2 text-sm text-red-600">
              {errors.website.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Timezone
          </label>

          <input
            {...register("timezone")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Address
        </label>

        <input
          {...register("address")}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            City
          </label>

          <input
            {...register("city")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            State
          </label>

          <input
            {...register("state")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Postal Code
          </label>

          <input
            {...register("postalCode")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Country
          </label>

          <input
            {...register("country")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
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
