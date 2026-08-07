/**
 * Customer details component.
 *
 * Displays detailed information
 * about a customer.
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
export interface CustomerDetailsProps {
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
   * Industry.
   */
  readonly industry?: string;

  /**
   * Address.
   */
  readonly address?: string;

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

  /**
   * Updated date.
   */
  readonly updatedAt?: string | Date;
}

/**
 * Customer details component.
 *
 * @param props Component properties.
 * @returns Customer details.
 */
export function CustomerDetails({
  name,
  company,
  email,
  phone,
  contactPerson,
  status,
  industry,
  address,
  organizationCount,
  projectCount,
  ticketCount,
  createdAt,
  updatedAt,
}: CustomerDetailsProps): React.JSX.Element {
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
              "Customer details"}
          </p>
        </div>
      </div>


      <div className="grid gap-6 md:grid-cols-2">

        <DetailItem
          icon={
            <Building2
              size={18}
              className="text-blue-600"
            />
          }
          label="Company"
          value={company}
        />


        <DetailItem
          icon={
            <Mail
              size={18}
              className="text-green-600"
            />
          }
          label="Email"
          value={email}
        />


        <DetailItem
          icon={
            <Phone
              size={18}
              className="text-purple-600"
            />
          }
          label="Phone"
          value={phone}
        />


        <DetailItem
          icon={
            <User
              size={18}
              className="text-indigo-600"
            />
          }
          label="Contact Person"
          value={contactPerson}
        />


        <DetailItem
          icon={
            <Building2
              size={18}
              className="text-orange-600"
            />
          }
          label="Industry"
          value={industry}
        />


        <DetailItem
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


        <DetailItem
          icon={
            <Building2
              size={18}
              className="text-blue-600"
            />
          }
          label="Organizations"
          value={
            organizationCount.toString()
          }
        />


        <DetailItem
          icon={
            <Building2
              size={18}
              className="text-green-600"
            />
          }
          label="Projects"
          value={
            projectCount.toString()
          }
        />


        <DetailItem
          icon={
            <User
              size={18}
              className="text-slate-600"
            />
          }
          label="Address"
          value={address}
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
  readonly icon: React.JSX.Element;
  readonly label: string;
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
      <div>
        {icon}
      </div>

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