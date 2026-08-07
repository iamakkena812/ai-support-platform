/**
 * Create customer page.
 *
 * Displays customer creation form.
 */

import {
  useNavigate,
} from "react-router-dom";

import {
  CustomerForm,
} from "../components";

import {
  customerService,
} from "../services/customer.service";

import type {
  CustomerFormValues,
} from "../components/CustomerForm";

/**
 * Create customer page component.
 *
 * @returns Create customer page.
 */
export function CreateCustomerPage(): React.JSX.Element {
  const navigate =
    useNavigate();

  async function handleCreate(
    values: CustomerFormValues,
  ): Promise<void> {
    await customerService.createCustomer({
      name: values.name,
      company:
        values.company || undefined,
      email: values.email,
      phone:
        values.phone || undefined,
      contactPerson:
        values.contactPerson || undefined,
      industry:
        values.industry || undefined,
      address:
        values.address || undefined,
      status:
        values.status as
          | "ACTIVE"
          | "INACTIVE"
          | "PROSPECT"
          | "PENDING"
          | "SUSPENDED"
          | "BLOCKED",
    });

    navigate(
      "/customers",
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Create Customer
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Add a new customer to the platform.
        </p>
      </div>

      <CustomerForm
        onSubmit={
          handleCreate
        }
        submitLabel="Create Customer"
      />
    </div>
  );
}