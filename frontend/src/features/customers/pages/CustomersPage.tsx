/**
 * Customers page.
 */

import {
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { CustomerFilters } from "../components/CustomerFilters";
import { CustomerTable } from "../components/CustomerTable";
import { DeleteCustomerDialog } from "../components/DeleteCustomerDialog";

import { useCustomers } from "../hooks/useCustomers";

import type {
  Customer,
} from "../types/customer.types";

/**
 * Customers page.
 */
export function CustomersPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [page, setPage] =
    useState(1);

  const [size] =
    useState(10);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<boolean>();

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] =
    useState<Customer | null>(
      null,
    );

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] =
    useState(false);

  const {
    data,
    isLoading,
    refetch,
  } = useCustomers(
    page,
    size,
  );

  const customers =
    data?.items.filter(
      (customer) => {
        const matchesSearch =
          search === "" ||
          customer.firstName
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ) ||
          customer.lastName
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ) ||
          customer.email
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            );

        const matchesStatus =
          status === undefined ||
          customer.isActive ===
            status;

        return (
          matchesSearch &&
          matchesStatus
        );
      },
    ) ?? [];

  const handleView = (
    customer: Customer,
  ): void => {
    navigate(
      `/customers/${customer.id}`,
    );
  };

  const handleEdit = (
    customer: Customer,
  ): void => {
    navigate(
      `/customers/${customer.id}/edit`,
    );
  };

  const handleDelete = (
    customer: Customer,
  ): void => {
    setSelectedCustomer(
      customer,
    );

    setDeleteDialogOpen(
      true,
    );
  };

  const confirmDelete =
    async (): Promise<void> => {
      if (
        selectedCustomer === null
      ) {
        return;
      }

      // TODO:
      // Call CustomerService.deleteCustomer()

      setDeleteDialogOpen(
        false,
      );

      setSelectedCustomer(
        null,
      );

      await refetch();
    };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Customers
          </h1>

          <p className="text-gray-600">
            Manage customer
            records.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/customers/create",
            )
          }
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Customer
        </button>
      </div>

      <CustomerFilters
        search={search}
        isActive={status}
        onSearchChange={
          setSearch
        }
        onStatusChange={
          setStatus
        }
        onReset={() => {
          setSearch("");

          setStatus(
            undefined,
          );
        }}
      />

      {isLoading ? (
        <div className="rounded-lg bg-white p-8 text-center">
          Loading customers...
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          onView={
            handleView
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDelete
          }
        />
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={
            page === 1
          }
          onClick={() =>
            setPage(
              (current) =>
                current - 1,
            )
          }
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page}
        </span>

        <button
          type="button"
          disabled={
            customers.length <
            size
          }
          onClick={() =>
            setPage(
              (current) =>
                current + 1,
            )
          }
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <DeleteCustomerDialog
        open={
          deleteDialogOpen
        }
        customer={
          selectedCustomer
        }
        onCancel={() => {
          setDeleteDialogOpen(
            false,
          );

          setSelectedCustomer(
            null,
          );
        }}
        onConfirm={
          confirmDelete
        }
      />
    </section>
  );
}