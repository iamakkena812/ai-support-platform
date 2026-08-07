/**
 * Team members component.
 *
 * Displays members belonging
 * to a team.
 */

import {
  Crown,
  Shield,
  User,
  Users,
} from "lucide-react";

import {
  UserAvatar,
} from "../../users/components";

/**
 * Team member.
 */
export interface TeamMember {
  /**
   * Member identifier.
   */
  readonly id: string;

  /**
   * Full name.
   */
  readonly name: string;

  /**
   * Email address.
   */
  readonly email: string;

  /**
   * Avatar image.
   */
  readonly avatarUrl?: string;

  /**
   * Team role.
   */
  readonly role: string;
}

/**
 * Component properties.
 */
export interface TeamMembersProps {
  /**
   * Team members.
   */
  readonly members: readonly TeamMember[];
}

/**
 * Returns role icon.
 *
 * @param role Member role.
 * @returns Role icon.
 */
function getRoleIcon(
  role: string,
): React.JSX.Element {
  switch (
    role.toUpperCase()
  ) {
    case "LEAD":
      return (
        <Crown
          size={16}
          className="text-yellow-600"
        />
      );

    case "ADMIN":
      return (
        <Shield
          size={16}
          className="text-blue-600"
        />
      );

    default:
      return (
        <User
          size={16}
          className="text-slate-600"
        />
      );
  }
}

/**
 * Team members component.
 *
 * @param props Component properties.
 * @returns Team members component.
 */
export function TeamMembers({
  members,
}: TeamMembersProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Users
          size={22}
          className="text-blue-600"
        />

        <h2 className="text-lg font-semibold text-slate-900">
          Team Members
        </h2>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-slate-500">
          No team members found.
        </p>
      ) : (
        <div className="space-y-4">
          {members.map(
            (member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-center gap-4">
                  <UserAvatar
                    name={member.name}
                    imageUrl={member.avatarUrl}
                    size="md"
                  />

                  <div>
                    <p className="font-medium text-slate-900">
                      {member.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {getRoleIcon(
                    member.role,
                  )}

                  {member.role}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}