/**
 * Create organization page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { OrganizationForm } from "../components/OrganizationForm";
import { OrganizationService } from "../services/organization.service";

import type {
  CreateOrganizationRequest,
} from "../types/organization.types";

/**
 * Create organization page.
 */
export function CreateOrganizationPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] =
    useState(false);

  /**
   * Handles form submission.
   */
  async function handleSubmit(
    values: CreateOrganizationRequest,
  ): Promise<void> {
    try {
      setIsLoading(true);

      await OrganizationService.createOrganization(
        values,
      );

      navigate("/organizations");
    } finally {
      setIsLoading(false);
    }
  }

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

      <OrganizationForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}