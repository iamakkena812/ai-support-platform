/**
 * Project form component.
 *
 * Displays a reusable form for
 * creating and editing projects.
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
 * Status options.
 */
const STATUS_OPTIONS = [
  {
    label: "Planning",
    value: "PLANNING",
  },
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "On Hold",
    value: "ON_HOLD",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
] as const;

/**
 * Select option.
 */
export interface SelectOption {
  /**
   * Option label.
   */
  readonly label: string;

  /**
   * Option value.
   */
  readonly value: string;
}

/**
 * Form values.
 */
export interface ProjectFormValues {
  /**
   * Project name.
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
   * Team identifier.
   */
  readonly teamId: string;

  /**
   * Owner identifier.
   */
  readonly ownerId: string;

  /**
   * Status.
   */
  readonly status: string;

  /**
   * Start date.
   */
  readonly startDate: string;

  /**
   * End date.
   */
  readonly endDate: string;
}

/**
 * Component properties.
 */
export interface ProjectFormProps {
  /**
   * Initial values.
   */
  readonly initialValues?: Partial<ProjectFormValues>;

  /**
   * Organization options.
   */
  readonly organizations: readonly SelectOption[];

  /**
   * Team options.
   */
  readonly teams: readonly SelectOption[];

  /**
   * Owner options.
   */
  readonly owners: readonly SelectOption[];

  /**
   * Submit callback.
   */
  readonly onSubmit: (
    values: ProjectFormValues,
  ) => void | Promise<void>;

  /**
   * Indicates submission state.
   */
  readonly isSubmitting?: boolean;

  /**
   * Submit button label.
   */
  readonly submitLabel?: string;
}

/**
 * Project form component.
 *
 * @param props Component properties.
 * @returns Project form component.
 */
export function ProjectForm({
  initialValues,
  organizations,
  teams,
  owners,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Project",
}: ProjectFormProps): React.JSX.Element {
  const [
    values,
    setValues,
  ] = useState<ProjectFormValues>({
    name:
      initialValues?.name ?? "",
    description:
      initialValues?.description ?? "",
    organizationId:
      initialValues?.organizationId ??
      "",
    teamId:
      initialValues?.teamId ?? "",
    ownerId:
      initialValues?.ownerId ?? "",
    status:
      initialValues?.status ??
      "PLANNING",
    startDate:
      initialValues?.startDate ?? "",
    endDate:
      initialValues?.endDate ?? "",
  });

  function updateField<
    K extends keyof ProjectFormValues,
  >(
    key: K,
    value: ProjectFormValues[K],
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
          label="Project Name"
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
          value={values.organizationId}
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

        <Select
          label="Team"
          value={values.teamId}
          options={teams}
          placeholder="Select team"
          onChange={(event) =>
            updateField(
              "teamId",
              event.target.value,
            )
          }
          required
        />

        <Select
          label="Project Owner"
          value={values.ownerId}
          options={owners}
          placeholder="Select owner"
          onChange={(event) =>
            updateField(
              "ownerId",
              event.target.value,
            )
          }
          required
        />

        <Input
          label="Description"
          value={values.description}
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

        <Input
          label="Start Date"
          type="date"
          value={values.startDate}
          onChange={(event) =>
            updateField(
              "startDate",
              event.target.value,
            )
          }
        />

        <Input
          label="End Date"
          type="date"
          value={values.endDate}
          onChange={(event) =>
            updateField(
              "endDate",
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