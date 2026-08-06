/**
 * Edit ticket page.
 */

import { useNavigate, useParams } from "react-router-dom";

import { TicketForm } from "../components/TicketForm";
import { useTicket } from "../hooks/useTicket";
import { useUpdateTicket } from "../hooks/useTickets";

import type { TicketFormValues } from "../components/TicketForm";

/**
 * Edit ticket page.
 */
export function EditTicketPage(): React.JSX.Element {
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

  const updateTicketMutation =
    useUpdateTicket();

  /**
   * Handles ticket update.
   *
   * @param values - Ticket form values.
   */
  const handleSubmit = async (
    values: TicketFormValues,
  ): Promise<void> => {
    await updateTicketMutation.mutateAsync({
      ticketId,
      payload: {
        title: values.title,
        description: values.description,
        status: values.status,
        type: values.type,
        priority: values.priority,
        assigneeId: values.assigneeId,
        projectId: values.projectId,
      },
    });

    navigate("/tickets");
  };

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
          : "Failed to load ticket."}
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Ticket
        </h1>

        <p className="mt-2 text-gray-600">
          Update ticket information.
        </p>
      </div>

      <TicketForm
        initialValue={ticket}
        onSubmit={handleSubmit}
        isSubmitting={
          updateTicketMutation.isPending
        }
      />
    </div>
  );
}