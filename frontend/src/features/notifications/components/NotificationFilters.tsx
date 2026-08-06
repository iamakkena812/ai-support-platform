/**
 * Notification filters component.
 */

import {
  useEffect,
  useState,
} from "react";

import type {
  NotificationFilterValues,
  NotificationStatus,
  NotificationType,
} from "../types/notification.types";

/**
 * Component properties.
 */
export interface NotificationFiltersProps {
  /**
   * Initial filter values.
   */
  readonly initialValue?: NotificationFilterValues;

  /**
   * Invoked when filters change.
   */
  readonly onChange: (
    filters: NotificationFilterValues,
  ) => void;
}

/**
 * Notification filters.
 */
export function NotificationFilters({
  initialValue,
  onChange,
}: NotificationFiltersProps): React.JSX.Element {
  const [search, setSearch] =
    useState("");

  const [type, setType] =
    useState<
      NotificationType | undefined
    >(undefined);

  const [status, setStatus] =
    useState<
      NotificationStatus | undefined
    >(undefined);

  const [recipientId, setRecipientId] =
    useState("");

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setSearch(
      initialValue.search ?? "",
    );

    setType(
      initialValue.type,
    );

    setStatus(
      initialValue.status,
    );

    setRecipientId(
      initialValue.recipientId ??
        "",
    );
  }, [initialValue]);

  useEffect(() => {
    onChange({
      search:
        search.trim() === ""
          ? undefined
          : search,

      type,

      status,

      recipientId:
        recipientId.trim() === ""
          ? undefined
          : recipientId,
    });
  }, [
    search,
    type,
    status,
    recipientId,
    onChange,
  ]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Search
          </label>

          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Type
          </label>

          <select
            value={
              type ?? ""
            }
            onChange={(event) => {
              if (
                event.target.value ===
                ""
              ) {
                setType(
                  undefined,
                );

                return;
              }

              setType(
                event.target
                  .value as NotificationType,
              );
            }}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">
              All Types
            </option>

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
            value={
              status ?? ""
            }
            onChange={(event) => {
              if (
                event.target.value ===
                ""
              ) {
                setStatus(
                  undefined,
                );

                return;
              }

              setStatus(
                event.target
                  .value as NotificationStatus,
              );
            }}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">
              All Statuses
            </option>

            <option value="unread">
              Unread
            </option>

            <option value="read">
              Read
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Recipient ID
          </label>

          <input
            type="text"
            placeholder="Recipient ID"
            value={recipientId}
            onChange={(event) =>
              setRecipientId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}