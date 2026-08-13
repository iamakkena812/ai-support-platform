/**
 * Workflow creation form.
 */

import { type FC, type FormEvent, useState } from "react";

import type { WorkflowTrigger } from "../types/workflow.types";

/**
 * Component properties.
 */
export interface WorkflowFormProps {
  /**
   * Whether the form is submitting.
   */
  readonly isSubmitting?: boolean;

  /**
   * Invoked on submit with the form values.
   */
  readonly onSubmit: (values: {
    readonly name: string;
    readonly description: string;
    readonly trigger: WorkflowTrigger;
    readonly isActive: boolean;
  }) => void | Promise<void>;
}

const TRIGGER_OPTIONS: readonly WorkflowTrigger[] = [
  "ticket_created",
  "ticket_updated",
  "ticket_assigned",
  "ticket_resolved",
  "ticket_closed",
  "comment_created",
  "attachment_uploaded",
  "sla_breached",
];

/**
 * Workflow creation form.
 *
 * @param props - Component properties.
 * @returns Workflow form component.
 */
export const WorkflowForm: FC<WorkflowFormProps> = ({
  isSubmitting = false,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trigger, setTrigger] = useState<WorkflowTrigger>("ticket_created");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (name.trim().length === 0) {
      return;
    }

    void onSubmit({
      name: name.trim(),
      description: description.trim(),
      trigger,
      isActive,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Trigger
        </label>

        <select
          value={trigger}
          onChange={(event) =>
            setTrigger(event.target.value as WorkflowTrigger)
          }
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm capitalize focus:border-blue-500 focus:outline-none"
        >
          {TRIGGER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
        />
        Active
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || name.trim().length === 0}
          className="rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Workflow"}
        </button>
      </div>
    </form>
  );
};
