/**
 * Customers page.
 *
 * Displays customer listing,
 * filtering, and management actions.
 */

import {
  useState,
} from "react";

import {
  CustomerCard,
  CustomerEmpty,
  CustomerError,
  CustomerFilters,
  CustomerHeader,
  CustomerSkeleton,
  CustomerStats,
  CustomerTable,
} from "../components";

import {
  useCustomers,
} from "../hooks/useCustomers";

/**
 * Customers page component.
 *
 * @returns Customers page.
 */
export function CustomersPage(): React.JSX.Element {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    industry,
    setIndustry,
  ] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useCustomers({
    filters: {
      search:
        search || undefined,

      status:
        status
          ? status as never
          : undefined,

      industry:
        industry || undefined,
    },
  });

  if (isLoading) {
    return (
      <CustomerSkeleton />
    );
  }

  if (isError) {
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

  const customers =
    data?.items ?? [];

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
                    customer.status === "ACTIVE",
                ).length
            }
            totalOrganizations={
                customers.reduce(
                (
                    total,
                    customer,
                ) =>
                    total +
                    customer.organizationCount,
                0,
                )
            }
            totalProjects={
                customers.reduce(
                (
                    total,
                    customer,
                ) =>
                    total +
                    customer.projectCount,
                0,
                )
            }
            openTickets={
                customers.reduce(
                (
                    total,
                    customer,
                ) =>
                    total +
                    customer.ticketCount,
                0,
                )
            }
            />

      <CustomerFilters
        search={search}
        status={status}
        industry={industry}
        industries={[]}
        onSearchChange={
          setSearch
        }
        onStatusChange={
          setStatus
        }
        onIndustryChange={
          setIndustry
        }
      />

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
                    company:
                      customer.company,
                    email:
                      customer.email,
                    phone:
                      customer.phone,
                    status:
                      customer.status,
                    organizationCount:
                      customer.organizationCount,
                    projectCount:
                      customer.projectCount,
                    ticketCount:
                      customer.ticketCount,
                  }),
                )
              }
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
                  company={
                    customer.company
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
                  organizationCount={
                    customer.organizationCount
                  }
                  projectCount={
                    customer.projectCount
                  }
                  ticketCount={
                    customer.ticketCount
                  }
                />
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
}