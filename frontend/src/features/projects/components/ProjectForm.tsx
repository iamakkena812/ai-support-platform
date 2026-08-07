/**
 * Project form component.
 *
 * Provides reusable form UI for creating
 * and updating projects.
 */

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  createProjectSchema,
} from "../schemas/project.schema";

import type {
  z,
} from "zod";

import type {
  CreateProjectRequest,
  Project,
} from "../types/project.types";


/**
 * Project form values.
 *
 * Uses Zod inferred type to keep
 * React Hook Form resolver compatible.
 */
export type ProjectFormValues =
  z.infer<
    typeof createProjectSchema
  >;


/**
 * Project form props.
 */
interface ProjectFormProps {

  /**
   * Initial project values.
   */
  readonly initialValue?: Project;


  /**
   * Submit handler.
   */
  readonly onSubmit: (
    values: CreateProjectRequest,
  ) => Promise<void>;


  /**
   * Loading state.
   */
  readonly isSubmitting?: boolean;
}


/**
 * Project form component.
 */
export function ProjectForm(
  {
    initialValue,
    onSubmit,
    isSubmitting = false,
  }: ProjectFormProps,
): React.JSX.Element {


  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } =
    useForm<ProjectFormValues>({

      resolver:
        zodResolver(
          createProjectSchema,
        ),


      defaultValues:
      {

        organizationId:
          initialValue
            ?.organization
            ?.id ?? "",


        name:
          initialValue
            ?.name ?? "",


        description:
          initialValue
            ?.description ?? "",


        priority:
          initialValue
            ?.priority ?? "medium",


        teamIds:
          initialValue
            ?.teams
            .map(
              (team) =>
                team.id,
            ) ?? [],


        memberIds:
          initialValue
            ?.members
            .map(
              (member) =>
                member.id,
            ) ?? [],


        startDate:
          initialValue
            ?.startDate ?? null,


        endDate:
          initialValue
            ?.endDate ?? null,

      },

    });


  /**
   * Handles form submission.
   *
   * Converts mutable arrays from Zod
   * into readonly arrays required by domain types.
   */
  async function submitHandler(
    values: ProjectFormValues,
  ): Promise<void> {

    const payload: CreateProjectRequest =
    {
      ...values,

      teamIds:
        values.teamIds
          ? [
              ...values.teamIds,
            ]
          : undefined,


      memberIds:
        values.memberIds
          ? [
              ...values.memberIds,
            ]
          : undefined,
    };


    await onSubmit(
      payload,
    );

  }


  return (

    <form
      onSubmit={
        handleSubmit(
          submitHandler,
        )
      }
      className="space-y-6"
    >

      <div>

        <label
          className="block text-sm font-medium"
        >
          Project Name
        </label>


        <input
          {...register(
            "name",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
        />


        {
          errors.name && (

            <p
              className="text-sm text-red-600"
            >
              {
                errors.name.message
              }
            </p>

          )
        }

      </div>


      <div>

        <label
          className="block text-sm font-medium"
        >
          Organization Id
        </label>


        <input
          {...register(
            "organizationId",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
        />

      </div>


      <div>

        <label
          className="block text-sm font-medium"
        >
          Description
        </label>


        <textarea
          {...register(
            "description",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
          rows={4}
        />

      </div>


      <div>

        <label
          className="block text-sm font-medium"
        >
          Priority
        </label>


        <select
          {...register(
            "priority",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
        >

          <option value="low">
            Low
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="high">
            High
          </option>

          <option value="critical">
            Critical
          </option>

        </select>

      </div>


      <div>

        <label
          className="block text-sm font-medium"
        >
          Start Date
        </label>


        <input
          type="date"
          {...register(
            "startDate",
          )}
          className="mt-1 w-full rounded border px-3 py-2"
        />

      </div>


      <div>

        <label
          className="block text-sm font-medium"
        >
          End Date
        </label>


        <input
          type="date"
          {...register(
            "endDate",
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
            : "Save Project"
        }

      </button>


    </form>

  );
}