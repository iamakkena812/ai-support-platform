/**
 * Edit customer page.
 *
 * Displays customer update form.
 */

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  CustomerError,
  CustomerForm,
  CustomerSkeleton,
} from "../components";

import {
  useCustomer,
} from "../hooks/useCustomer";

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
 * Edit customer page component.
 *
 * @returns Edit customer page.
 */
export function EditCustomerPage(): React.JSX.Element {
  const navigate =
    useNavigate();

  const {
    id,
  } = useParams<{
    id: string;
  }>();

  const {
    data: customer,
    isLoading,
    isError,
    error,
    refetch,
  } = useCustomer({
    id: id ?? "",
    enabled:
      Boolean(id),
  });

  async function handleUpdate(
    values: CustomerFormValues,
  ): Promise<void> {
    if (!id) {
      return;
    }

    await customerService.updateCustomer(
      id,
      {
        name: values.name,

        companyName:
          values.companyName ||
          undefined,

        email:
          values.email,

        phone:
          values.phone ||
          undefined,

        website:
          values.website ||
          undefined,

        address:
          values.address ||
          undefined,

        city:
          values.city ||
          undefined,

        state:
          values.state ||
          undefined,

        country:
          values.country ||
          undefined,

        postalCode:
          values.postalCode ||
          undefined,

        customerType:
          values.customerType as CustomerType,

        status:
          values.status as CustomerStatus,
      },
    );

    navigate(
      `/customers/${id}`,
    );
  }

  if (isLoading) {
    return (
      <CustomerSkeleton />
    );
  }

  if (
    isError ||
    !customer
  ) {
    return (
      <CustomerError
        error={
          error instanceof Error
            ? error
            : undefined
        }
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Edit Customer
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Update customer information.
        </p>
      </div>

      <CustomerForm
        initialValues={{
          name:
            customer.name,

          companyName:
            customer.companyName ??
            "",

          email:
            customer.email,

          phone:
            customer.phone ??
            "",

          website:
            customer.website ??
            "",

          address:
            customer.address ??
            "",

          city:
            customer.city ??
            "",

          state:
            customer.state ??
            "",

          country:
            customer.country ??
            "",

          postalCode:
            customer.postalCode ??
            "",

          customerType:
            customer.customerType,

          status:
            customer.status,
        }}
        onSubmit={
          handleUpdate
        }
        submitLabel="Update Customer"
      />
    </div>
  );
}
