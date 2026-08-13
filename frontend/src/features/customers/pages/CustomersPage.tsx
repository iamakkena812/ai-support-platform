/**
 * Customers page.
 *
 * Displays customer listing,
 * filtering, and management actions.
 */

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  isAxiosError,
} from "axios";

import {
  CustomerCard,
  CustomerEmpty,
  CustomerError,
  CustomerFilters,
  CustomerHeader,
  CustomerSkeleton,
  CustomerStats,
  CustomerTable,
  DeleteCustomerDialog,
} from "../components";

import {
  useCustomers,
} from "../hooks/useCustomers";

import {
  customerService,
} from "../services/customer.service";

import type {
  Customer,
} from "../types/customer.types";

/**
 * Customers page component.
 *
 * @returns Customers page.
 */
export function CustomersPage(): React.JSX.Element {
  const navigate =
    useNavigate();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    pendingDelete,
    setPendingDelete,
  ] = useState<Customer | null>(null);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    deleteError,
    setDeleteError,
  ] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useCustomers({
    filters: {
      page: 1,
      pageSize: 100,
    },
  });

  const customers =
    useMemo(
      () => {
        const items =
          data?.items ?? [];

        return items.filter(
          (customer) => {
            const matchesSearch =
              !search ||
              customer.name
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
              !status ||
              customer.status === status;

            return (
              matchesSearch &&
              matchesStatus
            );
          },
        );
      },
      [
        data,
        search,
        status,
      ],
    );

  async function handleConfirmDelete(): Promise<void> {
    if (!pendingDelete) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await customerService.deleteCustomer(
        pendingDelete.id,
      );

      setPendingDelete(null);
      await refetch();
    } catch (deleteErr) {
      setDeleteError(
        isAxiosError(deleteErr) &&
          deleteErr.response?.status === 404
          ? "Customer was already deleted."
          : "Failed to delete customer. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <CustomerSkeleton />
    );
  }

  if (isError) {
    const is403 =
      isAxiosError(error) &&
      error.response?.status === 403;

    return (
      <CustomerError
        error={
          is403
            ? new Error(
                "You do not have permission to view customers.",
              )
            : error instanceof Error
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
      <CustomerHeader />

      <CustomerStats
        totalCustomers={
          data?.total ?? 0
        }
        activeCustomers={
          customers.filter(
            (customer) =>
              customer.status === "active",
          ).length
        }
        suspendedCustomers={
          customers.filter(
            (customer) =>
              customer.status === "suspended",
          ).length
        }
      />

      <CustomerFilters
        search={search}
        status={status}
        onSearchChange={
          setSearch
        }
        onStatusChange={
          setStatus
        }
      />

      {deleteError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {deleteError}
        </div>
      ) : null}

      {customers.length === 0 ? (
        <CustomerEmpty />
      ) : (
        <>
          <div className="hidden lg:block">
            <CustomerTable
              customers={
                customers.map(
                  (customer) => ({
                    id: customer.id,
                    name: customer.name,
                    companyName:
                      customer.companyName,
                    email:
                      customer.email,
                    phone:
                      customer.phone,
                    status:
                      customer.status,
                  }),
                )
              }
              onView={(id) =>
                navigate(
                  `/customers/${id}`,
                )
              }
              onEdit={(id) =>
                navigate(
                  `/customers/${id}/edit`,
                )
              }
              onDelete={(id) => {
                const customer =
                  customers.find(
                    (item) =>
                      item.id === id,
                  );

                if (customer) {
                  setDeleteError(null);
                  setPendingDelete(
                    customer,
                  );
                }
              }}
            />
          </div>

          <div className="grid gap-6 lg:hidden">
            {customers.map(
              (customer) => (
                <CustomerCard
                  key={
                    customer.id
                  }
                  id={
                    customer.id
                  }
                  name={
                    customer.name
                  }
                  companyName={
                    customer.companyName
                  }
                  email={
                    customer.email
                  }
                  phone={
                    customer.phone
                  }
                  status={
                    customer.status
                  }
                  onView={(id) =>
                    navigate(
                      `/customers/${id}`,
                    )
                  }
                  onEdit={(id) =>
                    navigate(
                      `/customers/${id}/edit`,
                    )
                  }
                  onDelete={() => {
                    setDeleteError(null);
                    setPendingDelete(
                      customer,
                    );
                  }}
                />
              ),
            )}
          </div>
        </>
      )}

      <DeleteCustomerDialog
        open={
          pendingDelete !== null
        }
        customerName={
          pendingDelete?.name
        }
        isDeleting={isDeleting}
        onClose={() => {
          setPendingDelete(null);
        }}
        onConfirm={
          handleConfirmDelete
        }
      />
    </div>
  );
}
