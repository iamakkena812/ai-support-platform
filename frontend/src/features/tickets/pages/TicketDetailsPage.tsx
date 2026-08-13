/**
 * Ticket details page.
 */

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Pencil,
} from "lucide-react";

import {
  Button,
} from "../../../components/ui";

import { TicketDetails } from "../components/TicketDetails";
import { useTicket } from "../hooks/useTicket";

/**
 * Ticket details page.
 */
export function TicketDetailsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const { ticketId = "" } = useParams<{
    ticketId: string;
  }>();

  const {
    data: ticket,
    isLoading,
    isError,
    error,
  } = useTicket(ticketId);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading ticket...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load the ticket."}
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Ticket not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            navigate("/tickets")
          }
        >
          <ArrowLeft size={18} />
          Back
        </Button>

        <Button
          type="button"
          onClick={() =>
            navigate(`/tickets/${ticket.id}/edit`)
          }
        >
          <Pencil size={18} />
          Edit Ticket
        </Button>
      </div>

      <TicketDetails
        id={ticket.id}
        title={ticket.title}
        description={ticket.description}
        status={ticket.status}
        priority={ticket.priority}
        assignedTo={ticket.assignedTo}
        createdAt={ticket.createdAt}
        updatedAt={ticket.updatedAt}
      />
    </div>
  );
}
