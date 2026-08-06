/**
 * Projects page.
 */

import {
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { DeleteProjectDialog } from "../components/DeleteProjectDialog";
import {
  ProjectFilters,
  type ProjectFiltersValues,
} from "../components/ProjectFilters";
import { ProjectTable } from "../components/ProjectTable";
import { useProjects } from "../hooks/useProjects";
import { ProjectService } from "../services/project.service";

import type {
  Project,
} from "../types/project.types";

/**
 * Projects page.
 */
export function ProjectsPage(): React.JSX.Element {
  const [page] = useState(1);

  const [size] = useState(10);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [filters, setFilters] =
    useState<ProjectFiltersValues>({
      search: "",
      status: "",
      customerId: "",
      ownerId: "",
    });

  const {
    data,
    isLoading,
    refetch,
  } = useProjects(
    page,
    size,
  );

  const projects = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.items.filter(
      (project) => {
        const matchesSearch =
          filters.search === "" ||
          project.name
            .toLowerCase()
            .includes(
              filters.search.toLowerCase(),
            );

        const matchesStatus =
          filters.status === "" ||
          project.status ===
            filters.status;

        const matchesCustomer =
          filters.customerId === "" ||
          project.customerId.includes(
            filters.customerId,
          );

        const matchesOwner =
          filters.ownerId === "" ||
          (project.ownerId ?? "").includes(
            filters.ownerId,
          );

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCustomer &&
          matchesOwner
        );
      },
    );
  }, [
    data,
    filters,
  ]);

  const handleDelete =
    async (
      project: Project,
    ): Promise<void> => {
      try {
        setIsDeleting(true);

        await ProjectService.deleteProject(
          project.id,
        );

        setSelectedProject(
          null,
        );

        await refetch();
      } finally {
        setIsDeleting(false);
      }
    };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        Loading projects...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Projects
          </h1>

          <p className="text-gray-600">
            Manage projects.
          </p>
        </div>

        <Link
          to="/projects/create"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Project
        </Link>
      </div>

      <ProjectFilters
        value={filters}
        onChange={setFilters}
      />

      <ProjectTable
        projects={projects}
        onView={(project) => {
          window.location.href =
            `/projects/${project.id}`;
        }}
        onEdit={(project) => {
          window.location.href =
            `/projects/${project.id}/edit`;
        }}
        onDelete={setSelectedProject}
      />

      <DeleteProjectDialog
        open={
          selectedProject !==
          null
        }
        project={
          selectedProject
        }
        isDeleting={
          isDeleting
        }
        onCancel={() =>
          setSelectedProject(
            null,
          )
        }
        onConfirm={
          handleDelete
        }
      />
    </section>
  );
}