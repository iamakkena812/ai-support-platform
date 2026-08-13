/**
 * Ticket details component.
 *
 * Displays detailed information
 * about a ticket.
 */

import {
  Calendar,
  User,
  Flag,
} from "lucide-react";

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
export interface TicketDetailsProps {

  /**
   * Ticket identifier.
   */
  readonly id: string;


  /**
   * Ticket title.
   */
  readonly title: string;


  /**
   * Description.
   */
  readonly description: string;


  /**
   * Status.
   */
  readonly status: TicketStatus;


  /**
   * Priority.
   */
  readonly priority: TicketPriority;


  /**
   * Assigned user identifier.
   */
  readonly assignedTo?: string | null;


  /**
   * Created date.
   */
  readonly createdAt: string | Date;


  /**
   * Updated date.
   */
  readonly updatedAt?: string | Date;
}


/**
 * Ticket details component.
 *
 * @param props Component properties.
 * @returns Ticket details.
 */
export function TicketDetails({
  id,
  title,
  description,
  status,
  priority,
  assignedTo,
  createdAt,
  updatedAt,
}: TicketDetailsProps): React.JSX.Element {

  const created =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt);


  const updated =
    updatedAt instanceof Date
      ? updatedAt
      : updatedAt
        ? new Date(updatedAt)
        : null;


  return (
    <section className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-sm text-slate-500">
            #{id.slice(0, 8)}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {title}
          </h2>
        </div>


        <div className="flex flex-wrap gap-3">

          <TicketStatusBadge
            status={status}
          />

          <TicketPriorityBadge
            priority={priority}
          />

        </div>

      </div>


      <div className="rounded-lg bg-slate-50 p-4">

        <p className="text-sm text-slate-600">
          Description
        </p>

        <p className="mt-2 whitespace-pre-wrap text-slate-900">
          {description}
        </p>

      </div>


      <div className="grid gap-6 md:grid-cols-2">


        <DetailItem
          icon={
            <User
              size={18}
              className="text-purple-600"
            />
          }
          label="Assigned To"
          value={
            assignedTo
              ? `#${assignedTo.slice(0, 8)}`
              : undefined
          }
        />


        <DetailItem
          icon={
            <Flag
              size={18}
              className="text-red-600"
            />
          }
          label="Priority"
          value={
            priority
          }
        />


        <DetailItem
          icon={
            <Calendar
              size={18}
              className="text-blue-600"
            />
          }
          label="Created"
          value={
            created.toLocaleString()
          }
        />


        <DetailItem
          icon={
            <Calendar
              size={18}
              className="text-slate-600"
            />
          }
          label="Updated"
          value={
            updated
              ? updated.toLocaleString()
              : "-"
          }
        />

      </div>

    </section>
  );
}


/**
 * Detail item properties.
 */
interface DetailItemProps {

  /**
   * Icon.
   */
  readonly icon: React.JSX.Element;


  /**
   * Label.
   */
  readonly label: string;


  /**
   * Value.
   */
  readonly value?: string;
}


/**
 * Detail item.
 *
 * @param props Component properties.
 * @returns Detail item.
 */
function DetailItem({
  icon,
  label,
  value,
}: DetailItemProps): React.JSX.Element {
  return (
    <div className="flex items-start gap-3">

      {icon}

      <div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-medium text-slate-900">
          {value ?? "-"}
        </p>

      </div>

    </div>
  );
}
