/**
 * Ticket priority badge component.
 *
 * Displays ticket priority
 * using a colored badge.
 */

import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Flame,
} from "lucide-react";

import type {
  TicketPriority,
} from "../types/ticket.types";


/**
 * Component properties.
 */
export interface TicketPriorityBadgeProps {

  /**
   * Ticket priority.
   */
  readonly priority: TicketPriority;
}


/**
 * Priority configuration.
 */
interface PriorityConfig {

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
 * Returns priority configuration.
 *
 * @param priority Ticket priority.
 * @returns Priority configuration.
 */
function getPriorityConfig(
  priority: TicketPriority,
): PriorityConfig {

  switch (priority) {

    case "low":
      return {
        label: "Low",
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: (
          <ArrowDown
            size={16}
          />
        ),
      };


    case "medium":
      return {
        label: "Medium",
        className:
          "border-blue-200 bg-blue-100 text-blue-700",
        icon: (
          <AlertCircle
            size={16}
          />
        ),
      };


    case "high":
      return {
        label: "High",
        className:
          "border-orange-200 bg-orange-100 text-orange-700",
        icon: (
          <ArrowUp
            size={16}
          />
        ),
      };


    case "critical":
      return {
        label: "Critical",
        className:
          "border-red-200 bg-red-100 text-red-700",
        icon: (
          <Flame
            size={16}
          />
        ),
      };


    default:
      return {
        label: priority,
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: (
          <AlertCircle
            size={16}
          />
        ),
      };
  }
}


/**
 * Ticket priority badge.
 *
 * @param props Component properties.
 * @returns Ticket priority badge.
 */
export function TicketPriorityBadge({
  priority,
}: TicketPriorityBadgeProps): React.JSX.Element {

  const config =
    getPriorityConfig(priority);


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
