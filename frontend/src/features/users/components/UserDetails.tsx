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
            Username
          </p>

          <p className="font-medium">
            {user.username}
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
            Status
          </p>

          <p className="font-medium">
            {user.isActive ? "Active" : "Inactive"}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Superuser
          </p>

          <p className="font-medium">
            {user.isSuperuser ? "Yes" : "No"}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Organization Id
          </p>

          <p className="font-medium">
            {user.organizationId}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Created
          </p>

          <p className="font-medium">
            {new Date(user.createdAt).toLocaleString()}
          </p>
        </div>

      </div>

    </div>
  );
}
