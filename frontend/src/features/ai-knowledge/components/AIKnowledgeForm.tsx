/**
 * AI knowledge base form component.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  AIKnowledgeBase,
  AIKnowledgeVisibility,
} from "../types/aiKnowledge.types";

/**
 * AI knowledge base form values.
 */
export interface AIKnowledgeFormValues {
  readonly name: string;
  readonly description: string;
  readonly visibility: AIKnowledgeVisibility;
}

/**
 * Component properties.
 */
interface AIKnowledgeFormProps {
  /**
   * Initial knowledge base, when editing.
   */
  readonly initialValue?: AIKnowledgeBase;

  /**
   * Submit handler.
   */
  readonly onSubmit: (values: AIKnowledgeFormValues) => Promise<void> | void;

  /**
   * Loading state.
   */
  readonly isSubmitting?: boolean;
}

/**
 * AI knowledge base form.
 */
export function AIKnowledgeForm({
  initialValue,
  onSubmit,
  isSubmitting = false,
}: AIKnowledgeFormProps): React.JSX.Element {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] =
    useState<AIKnowledgeVisibility>("private");

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setName(initialValue.name);
    setDescription(initialValue.description ?? "");
    setVisibility(initialValue.visibility);
  }, [initialValue]);

  /**
   * Handles form submission.
   *
   * @param event - Form event.
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    await onSubmit({
      name,
      description,
      visibility,
    });
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">Name</label>

        <input
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Visibility</label>

        <select
          value={visibility}
          onChange={(event) =>
            setVisibility(event.target.value as AIKnowledgeVisibility)
          }
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="private">Private -- only visible to you</option>
          <option value="organization">
            Organization -- visible to everyone in your organization
          </option>
        </select>
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
              ? "Update Knowledge Base"
              : "Create Knowledge Base"}
        </button>
      </div>
    </form>
  );
}
