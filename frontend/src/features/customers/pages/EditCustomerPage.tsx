/**
 * Edit customer page.
 */

import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { CustomerForm } from "../components/CustomerForm";

import { useCustomer } from "../hooks/useCustomer";

import { CustomerService } from "../services/customer.service";

import type {
  UpdateCustomerRequest,
} from "../types/customer.types";

/**
 * Edit customer page.
 */
export function EditCustomerPage(): React.JSX.Element {
  const navigate = useNavigate();

  const { customerId = "" } =
    useParams<{
      customerId: string;
    }>();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const {
    data,
    isLoading,
    isError,
  } = useCustomer(customerId);

  /**
   * Handles customer update.
   */
  const handleSubmit = async (
    values: UpdateCustomerRequest,
  ): Promise<void> => {
    try {
      setIsSubmitting(true);

      await CustomerService.updateCustomer(
        customerId,
        values,
      );

      navigate("/customers");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 text-center">
        Loading customer...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg bg-white p-8 text-center">
        <h2 className="text-xl font-semibold">
          Customer not found
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate("/customers")
          }
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Edit Customer
          </h1>

          <p className="text-gray-600">
            Update customer information.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/customers")
          }
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <CustomerForm
        initialValue={data.customer}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </section>
  );
}