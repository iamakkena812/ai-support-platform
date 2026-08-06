/**
 * Edit project page.
 */

import { useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ProjectForm,
  type ProjectFormValues,
} from "../components/ProjectForm";
import { useProject } from "../hooks/useProject";
import { ProjectService } from "../services/project.service";

import type {
  UpdateProjectRequest,
} from "../types/project.types";

/**
 * Edit project page.
 */
export function EditProjectPage(): React.JSX.Element {
  const navigate = useNavigate();

  const { projectId = "" } =
    useParams<{
      projectId: string;
    }>();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const {
    data,
    isLoading,
    isError,
  } = useProject(projectId);

  /**
   * Handles project update.
   *
   * @param values Form values.
   */
  const handleSubmit = async (
    values: ProjectFormValues,
  ): Promise<void> => {
    const payload: UpdateProjectRequest = {
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

      await ProjectService.updateProject(
        projectId,
        payload,
      );

      navigate("/projects");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading project...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold text-red-600">
          Project not found
        </h1>

        <button
          type="button"
          onClick={() =>
            navigate("/projects")
          }
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Back
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Edit Project
          </h1>

          <p className="text-gray-600">
            Update project information.
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
        initialValue={
          data.project
        }
        isSubmitting={
          isSubmitting
        }
        onSubmit={
          handleSubmit
        }
      />
    </section>
  );
}