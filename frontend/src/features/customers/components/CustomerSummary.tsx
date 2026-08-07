/**
 * Customer summary component.
 *
 * Displays a summary of a customer.
 */

import {
  Building2,
  Calendar,
  Mail,
  Phone,
  Ticket,
  User,
} from "lucide-react";

import {
  CustomerStatusBadge,
} from "./CustomerStatusBadge";

import type {
  CustomerStatus,
} from "../types/customer.types";

/**
 * Component properties.
 */
export interface CustomerSummaryProps {
  /**
   * Customer name.
   */
  readonly name: string;

  /**
   * Company name.
   */
  readonly company?: string;

  /**
   * Email address.
   */
  readonly email: string;

  /**
   * Phone number.
   */
  readonly phone?: string;

  /**
   * Contact person.
   */
  readonly contactPerson?: string;

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
   * Created date.
   */
  readonly createdAt: string | Date;
}

/**
 * Customer summary component.
 *
 * @param props Component properties.
 * @returns Customer summary.
 */
export function CustomerSummary({
  name,
  company,
  email,
  phone,
  contactPerson,
  status,
  organizationCount,
  projectCount,
  ticketCount,
  createdAt,
}: CustomerSummaryProps): React.JSX.Element {
  const created =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt);

  return (
    <section className="rounded-lg border bg-white p-6 shadow-sm">

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-700">
          {name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              {name}
            </h2>

            <CustomerStatusBadge
              status={status}
            />
          </div>

          <p className="mt-2 text-slate-600">
            {company ??
              "Customer information"}
          </p>
        </div>
      </div>


      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <SummaryItem
          icon={
            <Building2
              size={18}
              className="text-blue-600"
            />
          }
          label="Company"
          value={
            company ?? "-"
          }
        />


        <SummaryItem
          icon={
            <Mail
              size={18}
              className="text-green-600"
            />
          }
          label="Email"
          value={email}
        />


        <SummaryItem
          icon={
            <Phone
              size={18}
              className="text-purple-600"
            />
          }
          label="Phone"
          value={
            phone ?? "-"
          }
        />


        <SummaryItem
          icon={
            <User
              size={18}
              className="text-indigo-600"
            />
          }
          label="Contact Person"
          value={
            contactPerson ?? "-"
          }
        />


        <SummaryItem
          icon={
            <Building2
              size={18}
              className="text-orange-600"
            />
          }
          label="Organizations"
          value={
            organizationCount.toString()
          }
        />


        <SummaryItem
          icon={
            <Ticket
              size={18}
              className="text-red-600"
            />
          }
          label="Tickets"
          value={
            ticketCount.toString()
          }
        />


        <SummaryItem
          icon={
            <Calendar
              size={18}
              className="text-slate-600"
            />
          }
          label="Created"
          value={
            created.toLocaleDateString()
          }
        />

      </div>


      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <MetricCard
          label="Projects"
          value={
            projectCount
          }
        />

        <MetricCard
          label="Organizations"
          value={
            organizationCount
          }
        />

      </div>

    </section>
  );
}


/**
 * Summary item properties.
 */
interface SummaryItemProps {
  readonly icon: React.JSX.Element;
  readonly label: string;
  readonly value: string;
}


/**
 * Summary item.
 *
 * @param props Component properties.
 * @returns Summary item.
 */
function SummaryItem({
  icon,
  label,
  value,
}: SummaryItemProps): React.JSX.Element {
  return (
    <div className="flex items-start gap-3">

      {icon}

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-medium text-slate-900">
          {value}
        </p>
      </div>

    </div>
  );
}


/**
 * Metric card properties.
 */
interface MetricCardProps {
  readonly label: string;
  readonly value: number;
}


/**
 * Metric card.
 *
 * @param props Component properties.
 * @returns Metric card.
 */
function MetricCard({
  label,
  value,
}: MetricCardProps): React.JSX.Element {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}