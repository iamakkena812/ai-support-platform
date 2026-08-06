/**
 * AI message input component.
 */

import { useState } from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

/**
 * Component properties.
 */
export interface AIMessageInputProps {
  /**
   * Indicates whether the input is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Placeholder text.
   */
  readonly placeholder?: string;

  /**
   * Invoked when a prompt is submitted.
   *
   * @param prompt - User prompt.
   */
  readonly onSend: (
    prompt: string,
  ) => void | Promise<void>;
}

/**
 * AI message input.
 *
 * @param props - Component properties.
 * @returns AI message input component.
 */
export function AIMessageInput({
  disabled = false,
  placeholder = "Ask AI anything...",
  onSend,
}: AIMessageInputProps): React.JSX.Element {
  const [prompt, setPrompt] =
    useState("");

  /**
   * Handles textarea changes.
   *
   * @param event - Change event.
   */
  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setPrompt(
      event.target.value,
    );
  };

  /**
   * Handles form submission.
   *
   * @param event - Form event.
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const value =
      prompt.trim();

    if (
      disabled ||
      value.length === 0
    ) {
      return;
    }

    try {
      await onSend(
        value,
      );

      setPrompt("");
    } catch (error) {
      console.error(
        "Failed to send message.",
        error,
      );
    }
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(
          event,
        );
      }}
      className="flex flex-col gap-4"
    >
      <textarea
        rows={4}
        value={prompt}
        onChange={
          handleChange
        }
        placeholder={
          placeholder
        }
        disabled={
          disabled
        }
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition-colors focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            disabled ||
            prompt.trim()
              .length === 0
          }
          className="rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled
            ? "Sending..."
            : "Send"}
        </button>
      </div>
    </form>
  );
}