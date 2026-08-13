/**
 * Create organization page.
 */

import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { OrganizationForm } from "../components/OrganizationForm";
import { useCreateOrganization } from "../hooks/useOrganizations";

import type {
  CreateOrganizationRequest,
} from "../types/organization.types";

/**
 * Create organization page.
 */
export function CreateOrganizationPage(): React.JSX.Element {
  const navigate = useNavigate();

  const createOrganization = useCreateOrganization();

  /**
   * Handles form submission.
   */
  async function handleSubmit(
    values: CreateOrganizationRequest,
  ): Promise<void> {
    await createOrganization.mutateAsync(values);

    navigate("/organizations");
  }

  const errorMessage =
    createOrganization.isError
      ? isAxiosError(createOrganization.error) &&
        typeof createOrganization.error.response?.data?.detail === "string"
        ? createOrganization.error.response.data.detail
        : "Failed to create organization. Please try again."
      : null;

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Create Organization
        </h1>

        <p className="mt-2 text-slate-600">
          Create a new organization.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <OrganizationForm
        onSubmit={handleSubmit}
        isLoading={createOrganization.isPending}
      />
    </div>
  );
}