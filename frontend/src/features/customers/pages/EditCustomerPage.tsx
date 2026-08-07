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

        company:
          values.company ||
          undefined,

        email:
          values.email,

        phone:
          values.phone ||
          undefined,

        contactPerson:
          values.contactPerson ||
          undefined,

        industry:
          values.industry ||
          undefined,

        address:
          values.address ||
          undefined,

        status:
          values.status as
            | "ACTIVE"
            | "INACTIVE"
            | "PROSPECT"
            | "PENDING"
            | "SUSPENDED"
            | "BLOCKED",
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

          company:
            customer.company ??
            "",

          email:
            customer.email,

          phone:
            customer.phone ??
            "",

          contactPerson:
            customer.contactPerson ??
            "",

          industry:
            customer.industry ??
            "",

          address:
            customer.address ??
            "",

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