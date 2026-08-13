/**
 * Create ticket page.
 */

import { useNavigate } from "react-router-dom";

import {
  TicketForm,
} from "../components/TicketForm";
import {
  useCreateTicket,
} from "../hooks/useTickets";

import type {
  TicketFormValues,
} from "../components/TicketForm";

/**
 * Create ticket page.
 */
export function CreateTicketPage(): React.JSX.Element {
  const navigate = useNavigate();

  const createTicketMutation =
    useCreateTicket();

  /**
   * Handles ticket creation.
   *
   * @param values - Ticket form values.
   */
  const handleSubmit = async (
    values: TicketFormValues,
  ): Promise<void> => {
    await createTicketMutation.mutateAsync({
      title: values.title,
      description:
        values.description,
      priority:
        values.priority,
      assignedTo:
        values.assignedTo,
    });

    navigate("/tickets");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Create Ticket
        </h1>

        <p className="mt-2 text-gray-600">
          Create a new support ticket.
        </p>
      </div>

      <TicketForm
        onSubmit={handleSubmit}
        isSubmitting={
          createTicketMutation.isPending
        }
      />
    </div>
  );
}
