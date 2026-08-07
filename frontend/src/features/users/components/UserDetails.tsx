/**
 * User details component.
 *
 * Displays complete information about a user.
 */

import type {
  User,
} from "../types/user.types";


/**
 * User details props.
 */
export interface UserDetailsProps {

  /**
   * User entity.
   */
  readonly user: User;
}


/**
 * User details component.
 *
 * @param props Component properties.
 * @returns User details component.
 */
export function UserDetails(
  {
    user,
  }: UserDetailsProps,
): React.JSX.Element {

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {user.fullName}
        </h2>

        <p className="text-sm text-slate-600">
          {user.email}
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <p className="text-sm text-slate-500">
            First Name
          </p>

          <p className="font-medium">
            {user.firstName}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Last Name
          </p>

          <p className="font-medium">
            {user.lastName}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Email
          </p>

          <p className="font-medium">
            {user.email}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Phone
          </p>

          <p className="font-medium">
            {user.phone ?? "-"}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Status
          </p>

          <p className="font-medium capitalize">
            {user.status}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Organization
          </p>

          <p className="font-medium">
            {
              user.organization?.name ?? "-"
            }
          </p>
        </div>

      </div>


      <div>
        <p className="text-sm text-slate-500">
          Roles
        </p>

        <div className="mt-2 flex flex-wrap gap-2">

          {
            user.roles.map(
              (role) => (
                <span
                  key={role.id}
                  className="rounded bg-slate-100 px-3 py-1 text-sm"
                >
                  {role.name}
                </span>
              ),
            )
          }

        </div>

      </div>

    </div>
  );
}