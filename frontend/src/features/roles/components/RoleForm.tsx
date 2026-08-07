/**
 * Role form component.
 *
 * Displays reusable form UI for
 * creating and updating roles.
 */

import {
  useState,
} from "react";

import {
  Button,
  Input,
} from "../../../components/ui";

import type {
  Permission,
} from "../types/role.types";


/**
 * Role form values.
 */
export interface RoleFormValues {


  /**
   * Role name.
   */
  readonly name: string;



  /**
   * Description.
   */
  readonly description: string;



  /**
   * Permission identifiers.
   */
  readonly permissionIds: readonly string[];

}



/**
 * Component properties.
 */
export interface RoleFormProps {


  /**
   * Initial values.
   */
  readonly initialValues?: Partial<RoleFormValues>;



  /**
   * Available permissions.
   */
  readonly permissions: readonly Permission[];



  /**
   * Submit callback.
   */
  readonly onSubmit: (
    values: RoleFormValues,
  ) => void | Promise<void>;



  /**
   * Loading state.
   */
  readonly isSubmitting?: boolean;



  /**
   * Button label.
   */
  readonly submitLabel?: string;

}



/**
 * Role form component.
 *
 * @param props Component properties.
 * @returns Role form.
 */
export function RoleForm({
  initialValues,
  permissions,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Role",
}: RoleFormProps): React.JSX.Element {


  const [
    values,
    setValues,
  ] =
    useState<RoleFormValues>(
      {

        name:
          initialValues?.name ??
          "",


        description:
          initialValues?.description ??
          "",


        permissionIds:
          initialValues?.permissionIds ??
          [],

      },
    );



  function updateField<K extends keyof RoleFormValues>(
    key: K,
    value: RoleFormValues[K],
  ): void {

    setValues(
      (
        previous,
      ) => ({

        ...previous,

        [key]:
          value,

      }),
    );

  }



  function togglePermission(
    id: string,
  ): void {

    const exists =
      values.permissionIds.includes(
        id,
      );


    updateField(
      "permissionIds",

      exists

        ? values.permissionIds.filter(
            (
              permissionId,
            ) =>
              permissionId !== id,
          )

        : [
            ...values.permissionIds,
            id,
          ],
    );

  }



  function handleSubmit(
    event: React.FormEvent,
  ): void {

    event.preventDefault();


    void onSubmit(
      values,
    );

  }



  return (

    <form

      onSubmit={
        handleSubmit
      }

      className="space-y-6"

    >


      <Input

        label="Role Name"

        value={
          values.name
        }

        onChange={
          (
            event,
          ) =>
            updateField(
              "name",
              event.target.value,
            )
        }

        required

      />



      <Input

        label="Description"

        value={
          values.description
        }

        onChange={
          (
            event,
          ) =>
            updateField(
              "description",
              event.target.value,
            )
        }

      />



      <div>

        <h3

          className="mb-3 font-semibold text-slate-900"

        >

          Permissions

        </h3>



        <div

          className="grid gap-3 md:grid-cols-2"

        >

          {
            permissions.map(
              (
                permission,
              ) => (

                <label

                  key={
                    permission.id
                  }

                  className="flex items-start gap-3 rounded-lg border border-slate-200 p-3"

                >

                  <input

                    type="checkbox"

                    checked={
                      values.permissionIds.includes(
                        permission.id,
                      )
                    }

                    onChange={() =>
                      togglePermission(
                        permission.id,
                      )
                    }

                  />


                  <div>

                    <p

                      className="font-medium text-slate-900"

                    >

                      {permission.name}

                    </p>


                    <p

                      className="text-sm text-slate-500"

                    >

                      {
                        permission.description ??
                        "No description available."
                      }

                    </p>


                  </div>


                </label>

              ),
            )
          }

        </div>


      </div>



      <div
        className="flex justify-end"
      >

        <Button

          type="submit"

          loading={
            isSubmitting
          }

        >

          {submitLabel}

        </Button>


      </div>


    </form>

  );

}