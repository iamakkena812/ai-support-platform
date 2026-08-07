/**
 * Customer details page.
 *
 * Displays complete customer information,
 * organizations, and projects.
 */

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Pencil,
} from "lucide-react";

import {
  Button,
} from "../../../components/ui";

import {
  CustomerDetails,
  CustomerError,
  CustomerOrganizations,
  CustomerProjects,
  CustomerSkeleton,
} from "../components";

import {
  useCustomer,
} from "../hooks/useCustomer";

/**
 * Customer details page component.
 *
 * @returns Customer details page.
 */
export function CustomerDetailsPage(): React.JSX.Element {
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
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            navigate(
              "/customers",
            )
          }
        >
          <ArrowLeft
            size={18}
          />

          Back
        </Button>

        <Button
          type="button"
          onClick={() =>
            navigate(
              `/customers/${customer.id}/edit`,
            )
          }
        >
          <Pencil
            size={18}
          />

          Edit Customer
        </Button>
      </div>

      <CustomerDetails
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
        contactPerson={
          customer.contactPerson
        }
        status={
          customer.status
        }
        industry={
          customer.industry
        }
        address={
          customer.address
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
        createdAt={
          customer.createdAt
        }
        updatedAt={
          customer.updatedAt
        }
      />

      <CustomerOrganizations
        organizations={[]}
        onViewOrganization={(organizationId) =>
          navigate(
            `/organizations/${organizationId}`,
          )
        }
      />

      <CustomerProjects
        projects={[]}
        onViewProject={(projectId) =>
          navigate(
            `/projects/${projectId}`,
          )
        }
      />
    </div>
  );
}