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

import type {
  CustomerStatus,
  CustomerType,
} from "../types/customer.types";

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
      companyName:
        values.companyName || undefined,
      email: values.email,
      phone:
        values.phone || undefined,
      website:
        values.website || undefined,
      address:
        values.address || undefined,
      city:
        values.city || undefined,
      state:
        values.state || undefined,
      country:
        values.country || undefined,
      postalCode:
        values.postalCode || undefined,
      customerType:
        values.customerType as CustomerType,
      status:
        values.status as CustomerStatus,
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
