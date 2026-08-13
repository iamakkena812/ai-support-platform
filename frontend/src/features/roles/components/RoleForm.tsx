/**
 * Role form component.
 *
 * Displays reusable form UI for
 * creating and updating roles.
 *
 * Permission assignment is a separate concern handled via the
 * dedicated role-permission mapping endpoint (see the Permissions
 * feature), not part of role create/update — the backend's
 * RoleCreate/RoleUpdate schemas do not accept permission ids.
 */

import {
  useState,
} from "react";

import {
  Button,
  Input,
} from "../../../components/ui";


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
