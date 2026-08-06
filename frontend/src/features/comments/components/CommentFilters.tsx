/**
 * Comment filters component.
 */

import {
  useEffect,
  useState,
} from "react";

import type { CommentFilterValues } from "../types/comment.types";

/**
 * Component properties.
 */
export interface CommentFiltersProps {
  /**
   * Initial filter values.
   */
  readonly initialValue?: CommentFilterValues;

  /**
   * Filter change handler.
   */
  readonly onChange: (
    filters: CommentFilterValues,
  ) => void;
}

/**
 * Comment filters.
 */
export function CommentFilters({
  initialValue,
  onChange,
}: CommentFiltersProps): React.JSX.Element {
  const [search, setSearch] =
    useState("");

  const [ticketId, setTicketId] =
    useState("");

  const [authorId, setAuthorId] =
    useState("");

  const [isInternal, setIsInternal] =
    useState<
      boolean | undefined
    >(undefined);

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    setSearch(
      initialValue.search ?? "",
    );

    setTicketId(
      initialValue.ticketId ?? "",
    );

    setAuthorId(
      initialValue.authorId ?? "",
    );

    setIsInternal(
      initialValue.isInternal,
    );
  }, [initialValue]);

  useEffect(() => {
    onChange({
      search:
        search.trim() === ""
          ? undefined
          : search,

      ticketId:
        ticketId.trim() === ""
          ? undefined
          : ticketId,

      authorId:
        authorId.trim() === ""
          ? undefined
          : authorId,

      isInternal,
    });
  }, [
    search,
    ticketId,
    authorId,
    isInternal,
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
            placeholder="Search comments..."
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
            Ticket ID
          </label>

          <input
            type="text"
            placeholder="Ticket ID"
            value={ticketId}
            onChange={(event) =>
              setTicketId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Author ID
          </label>

          <input
            type="text"
            placeholder="Author ID"
            value={authorId}
            onChange={(event) =>
              setAuthorId(
                event.target.value,
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Visibility
          </label>

          <select
            value={
              isInternal === undefined
                ? ""
                : String(
                    isInternal,
                  )
            }
            onChange={(event) => {
              if (
                event.target.value ===
                ""
              ) {
                setIsInternal(
                  undefined,
                );

                return;
              }

              setIsInternal(
                event.target.value ===
                  "true",
              );
            }}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">
              All
            </option>

            <option value="false">
              Public
            </option>

            <option value="true">
              Internal
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}