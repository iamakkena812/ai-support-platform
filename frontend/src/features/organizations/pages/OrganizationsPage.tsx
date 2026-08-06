/**
 * Organizations page.
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DeleteOrganizationDialog } from "../components/DeleteOrganizationDialog";
import { OrganizationFilters } from "../components/OrganizationFilters";
import { OrganizationTable } from "../components/OrganizationTable";
import { useOrganizations } from "../hooks/useOrganizations";

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

  const organizations = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.items.filter((organization) => {
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

  function confirmDelete(): void {
    console.log(
      "Delete organization:",
      selectedOrganization?.id,
    );

    setDeleteDialogOpen(false);
  }

  if (isLoading) {
    return (
      <div className="p-8">
        Loading organizations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load organizations.
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

      <DeleteOrganizationDialog
        open={deleteDialogOpen}
        organization={selectedOrganization}
        onCancel={() =>
          setDeleteDialogOpen(false)
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}