/**
 * User form component.
 *
 * Displays a reusable form for
 * creating and editing users.
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
 * Form values.
 */
export interface UserFormValues {
  /**
   * Full name.
   */
  readonly fullName: string;

  /**
   * Email.
   */
  readonly email: string;

  /**
   * Phone.
   */
  readonly phone: string;

  /**
   * Role.
   */
  readonly role: string;

  /**
   * Status.
   */
  readonly status: string;
}

/**
 * Component properties.
 */
export interface UserFormProps {
  /**
   * Initial values.
   */
  readonly initialValues?: Partial<UserFormValues>;

  /**
   * Submit callback.
   */
  readonly onSubmit: (
    values: UserFormValues,
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
 * User form.
 *
 * @param props Component properties.
 * @returns User form component.
 */
export function UserForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save User",
}: UserFormProps): React.JSX.Element {
  const [
    values,
    setValues,
  ] = useState<UserFormValues>({
    fullName:
      initialValues?.fullName ?? "",
    email:
      initialValues?.email ?? "",
    phone:
      initialValues?.phone ?? "",
    role:
      initialValues?.role ?? "USER",
    status:
      initialValues?.status ?? "ACTIVE",
  });

  function updateField<
    K extends keyof UserFormValues,
  >(
    key: K,
    value: UserFormValues[K],
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
          label="Full Name"
          value={values.fullName}
          onChange={(event) =>
            updateField(
              "fullName",
              event.target.value,
            )
          }
          required
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

        <Select
            label="Role"
            value={values.role}
            onChange={(event) =>
                updateField(
                "role",
                event.target.value,
                )
            }
            options={[
                {
                label: "Super Admin",
                value: "SUPER_ADMIN",
                },
                {
                label: "Administrator",
                value: "ADMIN",
                },
                {
                label: "Support Agent",
                value: "AGENT",
                },
                {
                label: "User",
                value: "USER",
                },
            ]}
            />

        <Select
            label="Status"
            value={values.status}
            onChange={(event) =>
                updateField(
                "status",
                event.target.value,
                )
            }
            options={[
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
                label: "Locked",
                value: "LOCKED",
                },
                {
                label: "Suspended",
                value: "SUSPENDED",
                },
            ]}
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