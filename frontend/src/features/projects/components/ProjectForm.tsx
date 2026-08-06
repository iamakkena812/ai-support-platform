/**
 * Project form component.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  Project,
  ProjectStatus,
} from "../types/project.types";

/**
 * Project form values.
 */
export interface ProjectFormValues {
  readonly organizationId?: string;
  readonly customerId: string;
  readonly ownerId: string | null;
  readonly name: string;
  readonly description: string | null;
  readonly status: ProjectStatus;
  readonly startDate: string | null;
  readonly endDate: string | null;
}

interface ProjectFormProps {
  /**
   * Initial project.
   */
  readonly initialValue?: Project;

  /**
   * Submit handler.
   */
  readonly onSubmit: (
    values: ProjectFormValues,
  ) => Promise<void> | void;

  /**
   * Loading state.
   */
  readonly isSubmitting?: boolean;
}

/**
 * Project form.
 */
export function ProjectForm({
  initialValue,
  onSubmit,
  isSubmitting = false,
}: ProjectFormProps): React.JSX.Element {
  const [organizationId, setOrganizationId] =
    useState("");

  const [customerId, setCustomerId] =
    useState("");

  const [ownerId, setOwnerId] =
    useState("");

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState<ProjectStatus>(
      "planning",
    );

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setOrganizationId(
      initialValue.organizationId,
    );

    setCustomerId(
      initialValue.customerId,
    );

    setOwnerId(
      initialValue.ownerId ?? "",
    );

    setName(
      initialValue.name,
    );

    setDescription(
      initialValue.description ?? "",
    );

    setStatus(
      initialValue.status,
    );

    setStartDate(
      initialValue.startDate ?? "",
    );

    setEndDate(
      initialValue.endDate ?? "",
    );
  }, [initialValue]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    await onSubmit({
      organizationId: initialValue
        ? undefined
        : organizationId,
      customerId,
      ownerId:
        ownerId.trim() === ""
          ? null
          : ownerId,
      name,
      description:
        description.trim() === ""
          ? null
          : description,
      status,
      startDate:
        startDate.trim() === ""
          ? null
          : startDate,
      endDate:
        endDate.trim() === ""
          ? null
          : endDate,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {!initialValue && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Organization ID
          </label>

          <input
            type="text"
            required
            value={organizationId}
            onChange={(event) =>
              setOrganizationId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Project Name
          </label>

          <input
            type="text"
            required
            value={name}
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as ProjectStatus,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="planning">
              Planning
            </option>
            <option value="active">
              Active
            </option>
            <option value="on_hold">
              On Hold
            </option>
            <option value="completed">
              Completed
            </option>
            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          rows={4}
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value,
            )
          }
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Customer ID
          </label>

          <input
            type="text"
            required
            value={customerId}
            onChange={(event) =>
              setCustomerId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Owner ID
          </label>

          <input
            type="text"
            value={ownerId}
            onChange={(event) =>
              setOwnerId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(event) =>
              setEndDate(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialValue
              ? "Update Project"
              : "Create Project"}
        </button>
      </div>
    </form>
  );
}