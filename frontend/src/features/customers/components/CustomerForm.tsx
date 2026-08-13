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
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
  {
    label: "Suspended",
    value: "suspended",
  },
] as const;

/**
 * Customer type options.
 */
const TYPE_OPTIONS = [
  {
    label: "Business",
    value: "business",
  },
  {
    label: "Individual",
    value: "individual",
  },
] as const;

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
  readonly companyName: string;

  /**
   * Email.
   */
  readonly email: string;

  /**
   * Phone.
   */
  readonly phone: string;

  /**
   * Website.
   */
  readonly website: string;

  /**
   * Address.
   */
  readonly address: string;

  /**
   * City.
   */
  readonly city: string;

  /**
   * State.
   */
  readonly state: string;

  /**
   * Country.
   */
  readonly country: string;

  /**
   * Postal code.
   */
  readonly postalCode: string;

  /**
   * Customer type.
   */
  readonly customerType: string;

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

    companyName:
      initialValues?.companyName ?? "",

    email:
      initialValues?.email ?? "",

    phone:
      initialValues?.phone ?? "",

    website:
      initialValues?.website ?? "",

    address:
      initialValues?.address ?? "",

    city:
      initialValues?.city ?? "",

    state:
      initialValues?.state ?? "",

    country:
      initialValues?.country ?? "",

    postalCode:
      initialValues?.postalCode ?? "",

    customerType:
      initialValues?.customerType ??
      "business",

    status:
      initialValues?.status ??
      "active",
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
          label="Company Name"
          value={values.companyName}
          onChange={(event) =>
            updateField(
              "companyName",
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
          label="Website"
          value={values.website}
          onChange={(event) =>
            updateField(
              "website",
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
        />

        <Input
          label="City"
          value={values.city}
          onChange={(event) =>
            updateField(
              "city",
              event.target.value,
            )
          }
        />

        <Input
          label="State"
          value={values.state}
          onChange={(event) =>
            updateField(
              "state",
              event.target.value,
            )
          }
        />

        <Input
          label="Country"
          value={values.country}
          onChange={(event) =>
            updateField(
              "country",
              event.target.value,
            )
          }
        />

        <Input
          label="Postal Code"
          value={values.postalCode}
          onChange={(event) =>
            updateField(
              "postalCode",
              event.target.value,
            )
          }
        />

        <Select
          label="Customer Type"
          value={values.customerType}
          options={TYPE_OPTIONS}
          onChange={(event) =>
            updateField(
              "customerType",
              event.target.value,
            )
          }
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
