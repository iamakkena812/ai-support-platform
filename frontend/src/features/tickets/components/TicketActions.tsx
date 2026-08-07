/**
 * Ticket actions component.
 *
 * Provides ticket management
 * action buttons.
 */

import {
  Edit,
  Eye,
  Trash2,
} from "lucide-react";


/**
 * Component properties.
 */
export interface TicketActionsProps {

  /**
   * View callback.
   */
  readonly onView?: () => void;


  /**
   * Edit callback.
   */
  readonly onEdit?: () => void;


  /**
   * Delete callback.
   */
  readonly onDelete?: () => void;
}


/**
 * Ticket actions component.
 *
 * @param props Component properties.
 * @returns Ticket actions.
 */
export function TicketActions({
  onView,
  onEdit,
  onDelete,
}: TicketActionsProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-end gap-2">

      {onView ? (
        <button
          type="button"
          onClick={onView}
          className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          title="View ticket"
        >
          <Eye
            size={16}
          />
        </button>
      ) : null}


      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-green-600"
          title="Edit ticket"
        >
          <Edit
            size={16}
          />
        </button>
      ) : null}


      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-red-600"
          title="Delete ticket"
        >
          <Trash2
            size={16}
          />
        </button>
      ) : null}

    </div>
  );
}