/**
 * Ticket card component.
 *
 * Displays ticket information
 * in a responsive card layout.
 */

import {
  User,
  Building2,
  Calendar,
} from "lucide-react";

import {
  TicketActions,
} from "./TicketActions";

import {
  TicketPriorityBadge,
} from "./TicketPriorityBadge";

import {
  TicketStatusBadge,
} from "./TicketStatusBadge";

import type {
  TicketPriority,
  TicketStatus,
} from "../types/ticket.types";


/**
 * Component properties.
 */
export interface TicketCardProps {

  /**
   * Ticket identifier.
   */
  readonly id: string;


  /**
   * Ticket number.
   */
  readonly ticketNumber: string;


  /**
   * Ticket title.
   */
  readonly title: string;


  /**
   * Ticket description.
   */
  readonly description: string;


  /**
   * Ticket status.
   */
  readonly status: TicketStatus;


  /**
   * Ticket priority.
   */
  readonly priority: TicketPriority;


  /**
   * Customer name.
   */
  readonly customerName?: string;


  /**
   * Assignee name.
   */
  readonly assignedUserName?: string;


  /**
   * Created date.
   */
  readonly createdAt: string | Date;


  /**
   * View callback.
   */
  readonly onView?: (
    id: string,
  ) => void;


  /**
   * Edit callback.
   */
  readonly onEdit?: (
    id: string,
  ) => void;


  /**
   * Delete callback.
   */
  readonly onDelete?: (
    id: string,
  ) => void;
}


/**
 * Ticket card component.
 *
 * @param props Component properties.
 * @returns Ticket card.
 */
export function TicketCard({
  id,
  ticketNumber,
  title,
  description,
  status,
  priority,
  customerName,
  assignedUserName,
  createdAt,
  onView,
  onEdit,
  onDelete,
}: TicketCardProps): React.JSX.Element {

  const created =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt);


  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-sm text-slate-500">
            {ticketNumber}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {title}
          </h3>
        </div>


        <TicketActions
          onView={
            onView
              ? () => onView(id)
              : undefined
          }
          onEdit={
            onEdit
              ? () => onEdit(id)
              : undefined
          }
          onDelete={
            onDelete
              ? () => onDelete(id)
              : undefined
          }
        />

      </div>


      <div className="mt-4 flex flex-wrap gap-3">

        <TicketStatusBadge
          status={status}
        />

        <TicketPriorityBadge
          priority={priority}
        />

      </div>


      <p className="mt-4 text-sm text-slate-600">
        {description}
      </p>


      <div className="mt-6 space-y-3 text-sm text-slate-600">

        {customerName ? (
          <div className="flex items-center gap-2">

            <Building2
              size={16}
            />

            <span>
              {customerName}
            </span>

          </div>
        ) : null}


        {assignedUserName ? (
          <div className="flex items-center gap-2">

            <User
              size={16}
            />

            <span>
              {assignedUserName}
            </span>

          </div>
        ) : null}


        <div className="flex items-center gap-2">

          <Calendar
            size={16}
          />

          <span>
            {created.toLocaleDateString()}
          </span>

        </div>

      </div>

    </div>
  );
}