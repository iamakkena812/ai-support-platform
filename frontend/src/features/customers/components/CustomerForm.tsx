/**
 * Customer form component.
 *
 * Displays a reusable form for
 * creating and editing customers.
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
 * Customer status options.
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
    label: "Prospect",
    value: "PROSPECT",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Suspended",
    value: "SUSPENDED",
  },
  {
    label: "Blocked",
    value: "BLOCKED",
  },
] as const;

/**
 * Select option.
 */
export interface CustomerSelectOption {
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
 * Customer form values.
 */
export interface CustomerFormValues {
  /**
   * Customer name.
   */
  readonly name: string;

  /**
   * Company name.
   */
  readonly company: string;

  /**
   * Email.
   */
  readonly email: string;

  /**
   * Phone.
   */
  readonly phone: string;

  /**
   * Contact person.
   */
  readonly contactPerson: string;

  /**
   * Industry.
   */
  readonly industry: string;

  /**
   * Address.
   */
  readonly address: string;

  /**
   * Status.
   */
  readonly status: string;
}

/**
 * Component properties.
 */
export interface CustomerFormProps {
  /**
   * Initial values.
   */
  readonly initialValues?: Partial<CustomerFormValues>;

  /**
   * Submit callback.
   */
  readonly onSubmit: (
    values: CustomerFormValues,
  ) => void | Promise<void>;

  /**
   * Submitting state.
   */
  readonly isSubmitting?: boolean;

  /**
   * Submit button label.
   */
  readonly submitLabel?: string;
}

/**
 * Customer form component.
 *
 * @param props Component properties.
 * @returns Customer form.
 */
export function CustomerForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Customer",
}: CustomerFormProps): React.JSX.Element {
  const [
    values,
    setValues,
  ] = useState<CustomerFormValues>({
    name:
      initialValues?.name ?? "",

    company:
      initialValues?.company ?? "",

    email:
      initialValues?.email ?? "",

    phone:
      initialValues?.phone ?? "",

    contactPerson:
      initialValues?.contactPerson ?? "",

    industry:
      initialValues?.industry ?? "",

    address:
      initialValues?.address ?? "",

    status:
      initialValues?.status ??
      "PROSPECT",
  });

  function updateField<
    K extends keyof CustomerFormValues,
  >(
    key: K,
    value: CustomerFormValues[K],
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
          label="Customer Name"
          value={values.name}
          onChange={(event) =>
            updateField(
              "name",
              event.target.value,
            )
          }
          required
        />

        <Input
          label="Company"
          value={values.company}
          onChange={(event) =>
            updateField(
              "company",
              event.target.value,
            )
          }
        />

        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) =>
            updateField(
              "email",
              event.target.value,
            )
          }
          required
        />

        <Input
          label="Phone"
          value={values.phone}
          onChange={(event) =>
            updateField(
              "phone",
              event.target.value,
            )
          }
        />

        <Input
          label="Contact Person"
          value={values.contactPerson}
          onChange={(event) =>
            updateField(
              "contactPerson",
              event.target.value,
            )
          }
        />

        <Input
          label="Industry"
          value={values.industry}
          onChange={(event) =>
            updateField(
              "industry",
              event.target.value,
            )
          }
        />

        <Input
          label="Address"
          value={values.address}
          onChange={(event) =>
            updateField(
              "address",
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