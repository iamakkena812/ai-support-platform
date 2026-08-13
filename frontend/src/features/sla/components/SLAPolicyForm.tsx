/**
 * SLA policy creation form.
 */

import { type FC, type FormEvent, useState } from "react";

import type { SLAPriority } from "../types/sla.types";

/**
 * Component properties.
 */
export interface SLAPolicyFormProps {
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
    readonly priority: SLAPriority;
    readonly firstResponseMinutes: number;
    readonly resolutionMinutes: number;
    readonly businessHoursOnly: boolean;
    readonly isActive: boolean;
  }) => void | Promise<void>;
}

const PRIORITY_OPTIONS: readonly SLAPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

/**
 * SLA policy creation form.
 *
 * @param props - Component properties.
 * @returns SLA policy form component.
 */
export const SLAPolicyForm: FC<SLAPolicyFormProps> = ({
  isSubmitting = false,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<SLAPriority>("medium");
  const [firstResponseMinutes, setFirstResponseMinutes] = useState(60);
  const [resolutionMinutes, setResolutionMinutes] = useState(480);
  const [businessHoursOnly, setBusinessHoursOnly] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (name.trim().length === 0) {
      return;
    }

    void onSubmit({
      name: name.trim(),
      description: description.trim(),
      priority,
      firstResponseMinutes,
      resolutionMinutes,
      businessHoursOnly,
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
          Priority
        </label>

        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as SLAPriority)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm capitalize focus:border-blue-500 focus:outline-none"
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            First Response (minutes)
          </label>

          <input
            type="number"
            min={1}
            value={firstResponseMinutes}
            onChange={(event) =>
              setFirstResponseMinutes(Number(event.target.value))
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Resolution (minutes)
          </label>

          <input
            type="number"
            min={1}
            value={resolutionMinutes}
            onChange={(event) =>
              setResolutionMinutes(Number(event.target.value))
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={businessHoursOnly}
          onChange={(event) => setBusinessHoursOnly(event.target.checked)}
        />
        Business hours only
      </label>

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
          {isSubmitting ? "Creating..." : "Create SLA Policy"}
        </button>
      </div>
    </form>
  );
};
