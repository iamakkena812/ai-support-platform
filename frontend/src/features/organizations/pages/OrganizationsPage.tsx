/**
 * Organizations page.
 */

import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DeleteOrganizationDialog } from "../components/DeleteOrganizationDialog";
import { OrganizationFilters } from "../components/OrganizationFilters";
import { OrganizationTable } from "../components/OrganizationTable";
import {
  useDeleteOrganization,
  useOrganizations,
} from "../hooks/useOrganizations";

import type {
  Organization,
} from "../types/organization.types";

/**
 * Organizations page.
 */
export function OrganizationsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization>();

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const {
    data,
    isLoading,
    error,
  } = useOrganizations();

  const deleteOrganization = useDeleteOrganization();

  const organizations = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.organizations.filter((organization) => {
      const matchesSearch =
        organization.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "all"
          ? true
          : status === "active"
            ? organization.isActive
            : !organization.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  function handleDelete(
    organization: Organization,
  ): void {
    setSelectedOrganization(organization);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete(): Promise<void> {
    if (!selectedOrganization) {
      return;
    }

    await deleteOrganization.mutateAsync(
      selectedOrganization.id,
    );

    setDeleteDialogOpen(false);
    setSelectedOrganization(undefined);
  }

  if (isLoading) {
    return (
      <div className="p-8">
        Loading organizations...
      </div>
    );
  }

  if (error) {
    const isForbidden =
      isAxiosError(error) &&
      error.response?.status === 403;

    return (
      <div className="p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">
            {isForbidden
              ? "Superuser access required"
              : "Failed to load organizations."}
          </p>

          <p className="mt-2 text-sm">
            {isForbidden
              ? "Organization management is restricted to platform superusers. Contact an administrator if you believe you should have access."
              : "An unexpected error occurred while loading organizations. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Organizations
        </h1>

        <button
          type="button"
          onClick={() =>
            navigate("/organizations/create")
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Organization
        </button>
      </div>

      <OrganizationFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      <OrganizationTable
        organizations={organizations}
        onView={(organization) =>
          navigate(
            `/organizations/${organization.id}`,
          )
        }
        onEdit={(organization) =>
          navigate(
            `/organizations/${organization.id}/edit`,
          )
        }
        onDelete={handleDelete}
      />

      {deleteOrganization.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to delete organization. Please try again.
        </div>
      )}

      <DeleteOrganizationDialog
        open={deleteDialogOpen}
        organization={selectedOrganization}
        isLoading={deleteOrganization.isPending}
        onCancel={() =>
          setDeleteDialogOpen(false)
        }
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </div>
  );
}