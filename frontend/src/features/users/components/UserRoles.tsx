/**
 * User roles component.
 *
 * Displays one or more user roles
 * as colored badges.
 */

import {
  Crown,
  Shield,
  UserCheck,
  UserRound,
} from "lucide-react";

/**
 * User role.
 */
export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "AGENT"
  | "USER";

/**
 * Component properties.
 */
export interface UserRolesProps {
  /**
   * User roles.
   */
  readonly roles: readonly string[];
}

/**
 * Returns badge configuration.
 *
 * @param role User role.
 * @returns Badge configuration.
 */
function getRoleConfig(
  role: string,
): {
  readonly label: string;
  readonly className: string;
  readonly icon: React.JSX.Element;
} {
  switch (
    role.toUpperCase()
  ) {
    case "SUPER_ADMIN":
      return {
        label: "Super Admin",
        className:
          "border-purple-200 bg-purple-100 text-purple-700",
        icon: (
          <Crown
            size={16}
          />
        ),
      };

    case "ADMIN":
      return {
        label: "Administrator",
        className:
          "border-blue-200 bg-blue-100 text-blue-700",
        icon: (
          <Shield
            size={16}
          />
        ),
      };

    case "AGENT":
      return {
        label: "Support Agent",
        className:
          "border-green-200 bg-green-100 text-green-700",
        icon: (
          <UserCheck
            size={16}
          />
        ),
      };

    case "USER":
      return {
        label: "User",
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: (
          <UserRound
            size={16}
          />
        ),
      };

    default:
      return {
        label: role,
        className:
          "border-slate-200 bg-slate-100 text-slate-700",
        icon: (
          <UserRound
            size={16}
          />
        ),
      };
  }
}

/**
 * User roles component.
 *
 * @param props Component properties.
 * @returns User roles component.
 */
export function UserRoles({
  roles,
}: UserRolesProps): React.JSX.Element {
  if (
    roles.length === 0
  ) {
    return (
      <span className="text-sm text-slate-500">
        No roles assigned
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {roles.map(
        (role) => {
          const config =
            getRoleConfig(
              role,
            );

          return (
            <span
              key={role}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
                config.className,
              ].join(" ")}
            >
              {config.icon}

              {config.label}
            </span>
          );
        },
      )}
    </div>
  );
}