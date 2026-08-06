/**
 * Ticket form component.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketType,
} from "../types/ticket.types";

/**
 * Ticket form values.
 */
export interface TicketFormValues {
  readonly organizationId?: string;
  readonly customerId: string;
  readonly projectId: string | null;
  readonly assigneeId: string | null;
  readonly title: string;
  readonly description: string;
  readonly type: TicketType;
  readonly priority: TicketPriority;
  readonly status: TicketStatus;
}

/**
 * Component properties.
 */
interface TicketFormProps {
  /**
   * Initial ticket.
   */
  readonly initialValue?: Ticket;

  /**
   * Submit handler.
   */
  readonly onSubmit: (
    values: TicketFormValues,
  ) => Promise<void> | void;

  /**
   * Loading state.
   */
  readonly isSubmitting?: boolean;
}

/**
 * Ticket form.
 */
export function TicketForm({
  initialValue,
  onSubmit,
  isSubmitting = false,
}: TicketFormProps): React.JSX.Element {
  const [organizationId, setOrganizationId] =
    useState("");

  const [customerId, setCustomerId] =
    useState("");

  const [projectId, setProjectId] =
    useState("");

  const [assigneeId, setAssigneeId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [type, setType] =
    useState<TicketType>("incident");

  const [priority, setPriority] =
    useState<TicketPriority>("medium");

  const [status, setStatus] =
    useState<TicketStatus>("new");

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setOrganizationId(
      initialValue.organization?.id ?? "",
    );

    setCustomerId(
      initialValue.customer?.id ?? "",
    );

    setProjectId(
      initialValue.project?.id ?? "",
    );

    setAssigneeId(
      initialValue.assignee?.id ?? "",
    );

    setTitle(
      initialValue.title,
    );

    setDescription(
      initialValue.description,
    );

    setType(
      initialValue.type,
    );

    setPriority(
      initialValue.priority,
    );

    setStatus(
      initialValue.status,
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
      projectId:
        projectId.trim() === ""
          ? null
          : projectId,
      assigneeId:
        assigneeId.trim() === ""
          ? null
          : assigneeId,
      title,
      description,
      type,
      priority,
      status,
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
            Title
          </label>

          <input
            type="text"
            required
            value={title}
            onChange={(event) =>
              setTitle(
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
                  .value as TicketStatus,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="new">New</option>
            <option value="open">Open</option>
            <option value="in_progress">
              In Progress
            </option>
            <option value="pending">
              Pending
            </option>
            <option value="resolved">
              Resolved
            </option>
            <option value="closed">
              Closed
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

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Type
          </label>

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target
                  .value as TicketType,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="incident">
              Incident
            </option>
            <option value="service_request">
              Service Request
            </option>
            <option value="bug">
              Bug
            </option>
            <option value="task">
              Task
            </option>
            <option value="question">
              Question
            </option>
            <option value="feature_request">
              Feature Request
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Priority
          </label>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target
                  .value as TicketPriority,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="low">
              Low
            </option>
            <option value="medium">
              Medium
            </option>
            <option value="high">
              High
            </option>
            <option value="urgent">
              Urgent
            </option>
          </select>
        </div>

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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Project ID
          </label>

          <input
            type="text"
            value={projectId}
            onChange={(event) =>
              setProjectId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Assignee ID
          </label>

          <input
            type="text"
            value={assigneeId}
            onChange={(event) =>
              setAssigneeId(
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
              ? "Update Ticket"
              : "Create Ticket"}
        </button>
      </div>
    </form>
  );
}