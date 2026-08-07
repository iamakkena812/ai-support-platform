/**
 * Organization details component.
 *
 * Displays detailed information about
 * an organization.
 */

import {
  Building2,
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  OrganizationStatusBadge,
} from "./OrganizationStatusBadge";

/**
 * Component properties.
 */
export interface OrganizationDetailsProps {
  /**
   * Organization name.
   */
  readonly name: string;

  /**
   * Organization code.
   */
  readonly code: string;

  /**
   * Organization description.
   */
  readonly description?: string;

  /**
   * Organization status.
   */
  readonly status: string;

  /**
   * Contact email.
   */
  readonly email?: string;

  /**
   * Contact phone.
   */
  readonly phone?: string;

  /**
   * Website.
   */
  readonly website?: string;

  /**
   * Address.
   */
  readonly address?: string;

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
 * Organization details component.
 *
 * @param props Component properties.
 * @returns Organization details.
 */
export function OrganizationDetails({
  name,
  code,
  description,
  status,
  email,
  phone,
  website,
  address,
  createdAt,
  updatedAt,
}: OrganizationDetailsProps): React.JSX.Element {
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
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
          <Building2
            size={30}
            className="text-blue-600"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              {name}
            </h2>

            <OrganizationStatusBadge
              status={status}
            />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Organization Code:{" "}
            <span className="font-medium text-slate-700">
              {code}
            </span>
          </p>

          {description ? (
            <p className="mt-4 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DetailItem
          icon={
            <Mail
              size={18}
              className="text-blue-600"
            />
          }
          label="Email"
          value={email}
        />

        <DetailItem
          icon={
            <Phone
              size={18}
              className="text-green-600"
            />
          }
          label="Phone"
          value={phone}
        />

        <DetailItem
          icon={
            <Globe
              size={18}
              className="text-purple-600"
            />
          }
          label="Website"
          value={website}
        />

        <DetailItem
          icon={
            <MapPin
              size={18}
              className="text-orange-600"
            />
          }
          label="Address"
          value={address}
        />

        <DetailItem
          icon={
            <Calendar
              size={18}
              className="text-indigo-600"
            />
          }
          label="Created"
          value={created.toLocaleString()}
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
              : undefined
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