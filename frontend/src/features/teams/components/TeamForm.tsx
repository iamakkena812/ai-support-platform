/**
 * Team form component.
 *
 * Displays a reusable form for
 * creating and editing teams.
 */

import {
  useState,
} from "react";

import {
  Button,
  Input,
  Select,
} from "../../../components/ui";

/**
 * Team status options.
 */
const STATUS_OPTIONS = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Inactive",
    value: "INACTIVE",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Archived",
    value: "ARCHIVED",
  },
] as const;

/**
 * Form values.
 */
export interface TeamFormValues {
  /**
   * Team name.
   */
  readonly name: string;

  /**
   * Description.
   */
  readonly description: string;

  /**
   * Organization identifier.
   */
  readonly organizationId: string;

  /**
   * Team status.
   */
  readonly status: string;
}

/**
 * Organization option.
 */
export interface OrganizationOption {
  /**
   * Organization identifier.
   */
  readonly value: string;

  /**
   * Organization name.
   */
  readonly label: string;
}

/**
 * Component properties.
 */
export interface TeamFormProps {
  /**
   * Initial values.
   */
  readonly initialValues?: Partial<TeamFormValues>;

  /**
   * Organizations.
   */
  readonly organizations: readonly OrganizationOption[];

  /**
   * Submit callback.
   */
  readonly onSubmit: (
    values: TeamFormValues,
  ) => void | Promise<void>;

  /**
   * Indicates submitting.
   */
  readonly isSubmitting?: boolean;

  /**
   * Submit button label.
   */
  readonly submitLabel?: string;
}

/**
 * Team form component.
 *
 * @param props Component properties.
 * @returns Team form.
 */
export function TeamForm({
  initialValues,
  organizations,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Team",
}: TeamFormProps): React.JSX.Element {
  const [
    values,
    setValues,
  ] = useState<TeamFormValues>({
    name:
      initialValues?.name ?? "",
    description:
      initialValues?.description ?? "",
    organizationId:
      initialValues?.organizationId ??
      "",
    status:
      initialValues?.status ??
      "ACTIVE",
  });

  function updateField<
    K extends keyof TeamFormValues,
  >(
    key: K,
    value: TeamFormValues[K],
  ): void {
    setValues(
      (previous) => ({
        ...previous,
        [key]: value,
      }),
    );
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();
    void onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Team Name"
          value={values.name}
          onChange={(event) =>
            updateField(
              "name",
              event.target.value,
            )
          }
          required
        />

        <Select
          label="Organization"
          value={
            values.organizationId
          }
          options={organizations}
          placeholder="Select organization"
          onChange={(event) =>
            updateField(
              "organizationId",
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
          onChange={(event) =>
            updateField(
              "description",
              event.target.value,
            )
          }
          className="md:col-span-2"
        />

        <Select
          label="Status"
          value={values.status}
          options={STATUS_OPTIONS}
          onChange={(event) =>
            updateField(
              "status",
              event.target.value,
            )
          }
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}