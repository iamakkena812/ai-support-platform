/**
 * Create customer page.
 */

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  CustomerForm,
} from "../components/CustomerForm";

import { CustomerService } from "../services/customer.service";

import type {
  CustomerFormValues,
} from "../components/CustomerForm";

import type {
  CreateCustomerRequest,
} from "../types/customer.types";

/**
 * Create customer page.
 */
export function CreateCustomerPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /**
   * Handles customer creation.
   */
  const handleSubmit = async (
    values: CustomerFormValues,
  ): Promise<void> => {
    if (values.organizationId === undefined) {
      throw new Error(
        "Organization ID is required.",
      );
    }

    const payload: CreateCustomerRequest = {
      organizationId: values.organizationId,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      company: values.company,
    };

    try {
      setIsSubmitting(true);

      await CustomerService.createCustomer(
        payload,
      );

      navigate("/customers");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Create Customer
          </h1>

          <p className="text-gray-600">
            Register a new customer.
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
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </section>
  );
}