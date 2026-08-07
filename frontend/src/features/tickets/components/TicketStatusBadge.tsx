/**
 * Ticket status badge component.
 *
 * Displays ticket status
 * using a colored badge.
 */

import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  PauseCircle,
  XCircle,
} from "lucide-react";

import type {
  TicketStatus,
} from "../types/ticket.types";


/**
 * Component properties.
 */
export interface TicketStatusBadgeProps {

  /**
   * Ticket status.
   */
  readonly status: TicketStatus;
}


/**
 * Status configuration.
 */
interface StatusConfig {

  /**
   * Display label.
   */
  readonly label: string;

  /**
   * Tailwind classes.
   */
  readonly className: string;

  /**
   * Icon.
   */
  readonly icon: React.JSX.Element;
}


/**
 * Returns ticket status configuration.
 *
 * @param status Ticket status.
 * @returns Status configuration.
 */
function getStatusConfig(
  status: TicketStatus,
): StatusConfig {

  switch (status) {

    case "OPEN":
      return {
        label: "Open",
        className:
          "border-blue-200 bg-blue-100 text-blue-700",
        icon: (
          <Clock3
            size={16}
          />
        ),
      };


    case "IN_PROGRESS":
      return {
        label: "In Progress",
        className:
          "border-purple-200 bg-purple-100 text-purple-700",
        icon: (
          <LoaderCircle
            size={16}
          />
        ),
      };


    case "WAITING":
      return {
        label: "Waiting",
        className:
          "border-yellow-200 bg-yellow-100 text-yellow-700",
        icon: (
          <PauseCircle
            size={16}
          />
        ),
      };


    case "RESOLVED":
      return {
        label: "Resolved",
        className:
          "border-green-200 bg-green-100 text-green-700",
        icon: (
          <CheckCircle2
            size={16}
          />
        ),
      };


    case "CLOSED":
      return {
        label: "Closed",
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: (
          <XCircle
            size={16}
          />
        ),
      };


    default:
      return {
        label: status,
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: (
          <Clock3
            size={16}
          />
        ),
      };
  }
}


/**
 * Ticket status badge.
 *
 * @param props Component properties.
 * @returns Ticket status badge.
 */
export function TicketStatusBadge({
  status,
}: TicketStatusBadgeProps): React.JSX.Element {

  const config =
    getStatusConfig(status);


  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
        config.className,
      ].join(" ")}
    >

      {config.icon}

      {config.label}

    </span>
  );
}