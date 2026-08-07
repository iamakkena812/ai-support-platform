/**
 * Customer card component.
 *
 * Displays customer information
 * in a responsive card layout.
 */

import {
  Building2,
  Mail,
  Phone,
} from "lucide-react";

import {
  CustomerActions,
} from "./CustomerActions";

import {
  CustomerStatusBadge,
} from "./CustomerStatusBadge";

import type {
  CustomerStatus,
} from "../types/customer.types";

/**
 * Component properties.
 */
export interface CustomerCardProps {
  /**
   * Customer identifier.
   */
  readonly id: string;

  /**
   * Customer name.
   */
  readonly name: string;

  /**
   * Company name.
   */
  readonly company?: string;

  /**
   * Email.
   */
  readonly email: string;

  /**
   * Phone.
   */
  readonly phone?: string;

  /**
   * Status.
   */
  readonly status: CustomerStatus;

  /**
   * Organization count.
   */
  readonly organizationCount: number;

  /**
   * Project count.
   */
  readonly projectCount: number;

  /**
   * Ticket count.
   */
  readonly ticketCount: number;

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
 * Customer card component.
 *
 * @param props Component properties.
 * @returns Customer card.
 */
export function CustomerCard({
  id,
  name,
  company,
  email,
  phone,
  status,
  organizationCount,
  projectCount,
  ticketCount,
  onView,
  onEdit,
  onDelete,
}: CustomerCardProps): React.JSX.Element {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {name}
          </h3>

          <CustomerStatusBadge
            status={status}
          />
        </div>

        <CustomerActions
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

      {company ? (
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Building2
            size={16}
          />

          <span>
            {company}
          </span>
        </div>
      ) : null}

      <div className="flex items-center gap-3 text-sm text-slate-600">
        <Mail
          size={16}
        />

        <span>
          {email}
        </span>
      </div>

      {phone ? (
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Phone
            size={16}
          />

          <span>
            {phone}
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        <Metric
          label="Organizations"
          value={
            organizationCount
          }
        />

        <Metric
          label="Projects"
          value={
            projectCount
          }
        />

        <Metric
          label="Tickets"
          value={
            ticketCount
          }
        />
      </div>
    </div>
  );
}

/**
 * Metric properties.
 */
interface MetricProps {
  readonly label: string;
  readonly value: number;
}

/**
 * Metric component.
 */
function Metric({
  label,
  value,
}: MetricProps): React.JSX.Element {
  return (
    <div className="rounded-md bg-slate-50 p-3 text-center">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="text-lg font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}