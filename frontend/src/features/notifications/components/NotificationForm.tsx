/**
 * Notification form component.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  Notification,
  NotificationStatus,
  NotificationType,
} from "../types/notification.types";

/**
 * Notification form values.
 */
export interface NotificationFormValues {
  /**
   * Recipient identifier.
   */
  readonly recipientId?: string;

  /**
   * Notification title.
   */
  readonly title: string;

  /**
   * Notification message.
   */
  readonly message: string;

  /**
   * Notification type.
   */
  readonly type: NotificationType;

  /**
   * Notification status.
   */
  readonly status: NotificationStatus;

  /**
   * Optional action URL.
   */
  readonly actionUrl: string | null;
}

/**
 * Component properties.
 */
interface NotificationFormProps {
  /**
   * Initial notification.
   */
  readonly initialValue?: Notification;

  /**
   * Submit handler.
   */
  readonly onSubmit: (
    values: NotificationFormValues,
  ) => Promise<void> | void;

  /**
   * Indicates whether the form is submitting.
   */
  readonly isSubmitting?: boolean;
}

/**
 * Notification form.
 */
export function NotificationForm({
  initialValue,
  onSubmit,
  isSubmitting = false,
}: NotificationFormProps): React.JSX.Element {
  const [recipientId, setRecipientId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [type, setType] =
    useState<NotificationType>(
      "info",
    );

  const [status, setStatus] =
    useState<NotificationStatus>(
      "unread",
    );

  const [actionUrl, setActionUrl] =
    useState("");

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setRecipientId(
      initialValue.recipient.id,
    );

    setTitle(
      initialValue.title,
    );

    setMessage(
      initialValue.message,
    );

    setType(
      initialValue.type,
    );

    setStatus(
      initialValue.status,
    );

    setActionUrl(
      initialValue.actionUrl ??
        "",
    );
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
      recipientId: initialValue
        ? undefined
        : recipientId,

      title,

      message,

      type,

      status,

      actionUrl:
        actionUrl.trim() === ""
          ? null
          : actionUrl,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      {!initialValue ? (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Recipient ID
          </label>

          <input
            type="text"
            required
            value={recipientId}
            onChange={(event) =>
              setRecipientId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      ) : null}

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
          Message
        </label>

        <textarea
          rows={5}
          required
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value,
            )
          }
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Type
          </label>

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target
                  .value as NotificationType,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="info">
              Info
            </option>

            <option value="success">
              Success
            </option>

            <option value="warning">
              Warning
            </option>

            <option value="error">
              Error
            </option>
          </select>
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
                  .value as NotificationStatus,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="unread">
              Unread
            </option>

            <option value="read">
              Read
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Action URL
        </label>

        <input
          type="url"
          value={actionUrl}
          onChange={(event) =>
            setActionUrl(
              event.target.value,
            )
          }
          placeholder="https://example.com"
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-5 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialValue
              ? "Update Notification"
              : "Create Notification"}
        </button>
      </div>
    </form>
  );
}