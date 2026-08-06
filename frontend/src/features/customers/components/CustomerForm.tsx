/**
 * Customer form component.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  Customer,
} from "../types/customer.types";

/**
 * Customer form values.
 */
export interface CustomerFormValues {
  readonly organizationId?: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly company: string | null;
}

interface CustomerFormProps {
  /**
   * Initial customer values.
   */
  readonly initialValue?: Customer;

  /**
   * Submit handler.
   */
  readonly onSubmit: (
    values: CustomerFormValues,
  ) => Promise<void> | void;

  /**
   * Whether the form is submitting.
   */
  readonly isSubmitting?: boolean;
}

/**
 * Customer form.
 */
export function CustomerForm({
  initialValue,
  onSubmit,
  isSubmitting = false,
}: CustomerFormProps): React.JSX.Element {
  const [organizationId, setOrganizationId] =
    useState("");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [company, setCompany] =
    useState("");

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setOrganizationId(
      initialValue.organizationId,
    );

    setFirstName(
      initialValue.firstName,
    );

    setLastName(
      initialValue.lastName,
    );

    setEmail(
      initialValue.email,
    );

    setPhone(
      initialValue.phone ?? "",
    );

    setCompany(
      initialValue.company ?? "",
    );
  }, [initialValue]);

  /**
   * Handles form submission.
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    await onSubmit({
      organizationId:
        initialValue === undefined
          ? organizationId
          : undefined,
      firstName,
      lastName,
      email,
      phone:
        phone.trim() === ""
          ? null
          : phone,
      company:
        company.trim() === ""
          ? null
          : company,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {!initialValue && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Organization ID
          </label>

          <input
            type="text"
            value={organizationId}
            onChange={(event) =>
              setOrganizationId(
                event.target.value,
              )
            }
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            First Name
          </label>

          <input
            type="text"
            value={firstName}
            onChange={(event) =>
              setFirstName(
                event.target.value,
              )
            }
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Last Name
          </label>

          <input
            type="text"
            value={lastName}
            onChange={(event) =>
              setLastName(
                event.target.value,
              )
            }
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value,
            )
          }
          required
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Company
          </label>

          <input
            type="text"
            value={company}
            onChange={(event) =>
              setCompany(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialValue
              ? "Update Customer"
              : "Create Customer"}
        </button>
      </div>
    </form>
  );
}