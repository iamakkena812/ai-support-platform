/**
 * User details component.
 *
 * Displays detailed information
 * about a user.
 */

import {
  Building2,
  Calendar,
  Mail,
  Phone,
  Shield,
} from "lucide-react";

import {
  UserStatusBadge,
} from "./UserStatusBadge";

/**
 * Component properties.
 */
export interface UserDetailsProps {
  /**
   * User full name.
   */
  readonly name: string;

  /**
   * Email address.
   */
  readonly email: string;

  /**
   * Phone number.
   */
  readonly phone?: string;

  /**
   * User role.
   */
  readonly role: string;

  /**
   * Organization.
   */
  readonly organization?: string;

  /**
   * User status.
   */
  readonly status: string;

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
 * User details component.
 *
 * @param props Component properties.
 * @returns User details component.
 */
export function UserDetails({
  name,
  email,
  phone,
  role,
  organization,
  status,
  createdAt,
  updatedAt,
}: UserDetailsProps): React.JSX.Element {
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
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              {name}
            </h2>

            <UserStatusBadge
              status={status}
            />
          </div>

          <p className="mt-2 text-slate-600">
            {email}
          </p>
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
            <Shield
              size={18}
              className="text-purple-600"
            />
          }
          label="Role"
          value={role}
        />

        <DetailItem
          icon={
            <Building2
              size={18}
              className="text-orange-600"
            />
          }
          label="Organization"
          value={organization}
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