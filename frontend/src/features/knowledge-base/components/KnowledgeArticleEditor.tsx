/**
 * Knowledge article editor component.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FC,
  FormEvent,
} from "react";

import type {
  CreateKnowledgeArticleRequest,
  KnowledgeArticleStatus,
} from "../types/knowledgeBase.types";

/**
 * Component properties.
 */
export interface KnowledgeArticleEditorProps {
  /**
   * Initial form values.
   */
  readonly initialValue?: CreateKnowledgeArticleRequest;

  /**
   * Indicates whether the form is submitting.
   */
  readonly isSubmitting?: boolean;

  /**
   * Invoked when the form is submitted.
   */
  readonly onSubmit: (
    values: CreateKnowledgeArticleRequest,
  ) => void | Promise<void>;
}

/**
 * Default form values.
 */
const defaultValues: CreateKnowledgeArticleRequest =
  {
    title: "",
    content: "",
    summary: "",
    categoryId: "",
    tags: [],
    status: "draft",
  };

/**
 * Knowledge article editor.
 *
 * @param props - Component properties.
 * @returns Knowledge article editor component.
 */
export const KnowledgeArticleEditor: FC<
  KnowledgeArticleEditorProps
> = ({
  initialValue,
  isSubmitting = false,
  onSubmit,
}) => {
  const [values, setValues] =
    useState<CreateKnowledgeArticleRequest>(
      initialValue ??
        defaultValues,
    );

  const [tags, setTags] =
    useState(
      values.tags.join(
        ", ",
      ),
    );

  useEffect(() => {
    if (
      initialValue
    ) {
      setValues(
        initialValue,
      );

      setTags(
        initialValue.tags.join(
          ", ",
        ),
      );
    }
  }, [
    initialValue,
  ]);

  /**
   * Updates a text field.
   *
   * @param field - Field name.
   * @param value - Field value.
   */
  const updateField = <
    K extends keyof CreateKnowledgeArticleRequest,
  >(
    field: K,
    value: CreateKnowledgeArticleRequest[K],
  ): void => {
    setValues(
      (
        previous,
      ) => ({
        ...previous,
        [field]: value,
      }),
    );
  };

  /**
   * Handles tag updates.
   *
   * @param event - Change event.
   */
  const handleTagsChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const value =
      event.target.value;

    setTags(
      value,
    );

    updateField(
      "tags",
      value
        .split(",")
        .map(
          (
            tag,
          ) =>
            tag.trim(),
        )
        .filter(
          Boolean,
        ),
    );
  };

  /**
   * Handles form submission.
   *
   * @param event - Form event.
   */
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    void onSubmit(
      values,
    );
  };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Title
        </label>

        <input
          type="text"
          value={
            values.title
          }
          onChange={(
            event,
          ) =>
            updateField(
              "title",
              event.target
                .value,
            )
          }
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Summary
        </label>

        <textarea
          rows={3}
          value={
            values.summary ??
            ""
          }
          onChange={(
            event,
          ) =>
            updateField(
              "summary",
              event.target
                .value,
            )
          }
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Content
        </label>

        <textarea
          rows={12}
          value={
            values.content
          }
          onChange={(
            event,
          ) =>
            updateField(
              "content",
              event.target
                .value,
            )
          }
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Category ID
          </label>

          <input
            type="text"
            value={
              values.categoryId
            }
            onChange={(
              event,
            ) =>
              updateField(
                "categoryId",
                event.target
                  .value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={
              values.status
            }
            onChange={(
              event,
            ) =>
              updateField(
                "status",
                event.target
                  .value as KnowledgeArticleStatus,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="draft">
              Draft
            </option>

            <option value="published">
              Published
            </option>

            <option value="archived">
              Archived
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tags
        </label>

        <input
          type="text"
          value={tags}
          onChange={
            handleTagsChange
          }
          placeholder="AI, Support, FAQ"
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : "Save Article"}
        </button>
      </div>
    </form>
  );
};