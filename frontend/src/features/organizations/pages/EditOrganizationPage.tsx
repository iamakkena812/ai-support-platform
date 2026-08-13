/**
 * Edit organization page.
 */

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { OrganizationForm } from "../components/OrganizationForm";
import { useOrganization } from "../hooks/useOrganization";
import { useUpdateOrganization } from "../hooks/useOrganizations";

import type {
  CreateOrganizationRequest,
} from "../types/organization.types";

/**
 * Edit organization page.
 */
export function EditOrganizationPage(): React.JSX.Element {
  const navigate = useNavigate();

  const { organizationId = "" } = useParams<{
    organizationId: string;
  }>();

  const {
    data,
    isLoading,
    error,
  } = useOrganization(organizationId);

  const updateOrganization = useUpdateOrganization();

  async function handleSubmit(
    values: CreateOrganizationRequest,
  ): Promise<void> {
    await updateOrganization.mutateAsync({
      id: organizationId,
      payload: values,
    });

    navigate("/organizations");
  }

  if (isLoading) {
    return (
      <div className="p-8">
        Loading organization...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load organization.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        Organization not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Organization
        </h1>

        <p className="mt-2 text-slate-600">
          Update organization information.
        </p>
      </div>

      <OrganizationForm
        initialValues={data}
        onSubmit={handleSubmit}
        isLoading={updateOrganization.isPending}
      />
    </div>
  );
}