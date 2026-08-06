/**
 * Create project page.
 */

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ProjectForm,
  type ProjectFormValues,
} from "../components/ProjectForm";
import { ProjectService } from "../services/project.service";

import type {
  CreateProjectRequest,
} from "../types/project.types";

/**
 * Create project page.
 */
export function CreateProjectPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /**
   * Handles project creation.
   *
   * @param values Form values.
   */
  const handleSubmit = async (
    values: ProjectFormValues,
  ): Promise<void> => {
    if (values.organizationId === undefined) {
      throw new Error(
        "Organization ID is required.",
      );
    }

    const payload: CreateProjectRequest = {
      organizationId:
        values.organizationId,

      customerId:
        values.customerId,

      ownerId:
        values.ownerId,

      name:
        values.name,

      description:
        values.description,

      status:
        values.status,

      startDate:
        values.startDate,

      endDate:
        values.endDate,
    };

    try {
      setIsSubmitting(true);

      await ProjectService.createProject(
        payload,
      );

      navigate("/projects");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Create Project
          </h1>

          <p className="text-gray-600">
            Create a new project.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/projects")
          }
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <ProjectForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </section>
  );
}