/**
 * Ticket details component.
 *
 * Displays detailed information
 * about a ticket.
 */

import {
  Building2,
  Calendar,
  User,
  Ticket,
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
   * Ticket number.
   */
  readonly ticketNumber: string;


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
   * Customer name.
   */
  readonly customerName?: string;


  /**
   * Organization name.
   */
  readonly organizationName?: string;


  /**
   * Project name.
   */
  readonly projectName?: string;


  /**
   * Assigned user.
   */
  readonly assignedUserName?: string;


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
  ticketNumber,
  title,
  description,
  status,
  priority,
  customerName,
  organizationName,
  projectName,
  assignedUserName,
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
            {ticketNumber}
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

        <p className="mt-2 text-slate-900">
          {description}
        </p>

      </div>


      <div className="grid gap-6 md:grid-cols-2">


        <DetailItem
          icon={
            <Building2
              size={18}
              className="text-blue-600"
            />
          }
          label="Customer"
          value={
            customerName
          }
        />


        <DetailItem
          icon={
            <Building2
              size={18}
              className="text-indigo-600"
            />
          }
          label="Organization"
          value={
            organizationName
          }
        />


        <DetailItem
          icon={
            <Ticket
              size={18}
              className="text-green-600"
            />
          }
          label="Project"
          value={
            projectName
          }
        />


        <DetailItem
          icon={
            <User
              size={18}
              className="text-purple-600"
            />
          }
          label="Assigned To"
          value={
            assignedUserName
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