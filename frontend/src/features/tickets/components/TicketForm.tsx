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
} from "../types/ticket.types";

/**
 * Ticket form values.
 */
export interface TicketFormValues {
  readonly title: string;
  readonly description: string;
  readonly priority: TicketPriority;
  readonly status: TicketStatus;
  readonly assignedTo: string | null;
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
  const [assignedTo, setAssignedTo] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<TicketPriority>("medium");

  const [status, setStatus] =
    useState<TicketStatus>("open");

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setAssignedTo(
      initialValue.assignedTo ?? "",
    );

    setTitle(
      initialValue.title,
    );

    setDescription(
      initialValue.description,
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
      title,
      description,
      priority,
      status,
      assignedTo:
        assignedTo.trim() === ""
          ? null
          : assignedTo,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Title
          </label>

          <input
            type="text"
            required
            minLength={5}
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        {initialValue ? (
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
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          rows={4}
          required
          minLength={10}
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
            <option value="critical">
              Critical
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Assignee User ID (optional)
          </label>

          <input
            type="text"
            value={assignedTo}
            onChange={(event) =>
              setAssignedTo(
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
