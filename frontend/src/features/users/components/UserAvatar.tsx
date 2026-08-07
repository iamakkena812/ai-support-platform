/**
 * User avatar component.
 *
 * Displays a user's avatar image or
 * falls back to initials.
 */

import {
  User,
} from "lucide-react";

/**
 * Avatar size.
 */
export type UserAvatarSize =
  | "sm"
  | "md"
  | "lg"
  | "xl";

/**
 * Component properties.
 */
export interface UserAvatarProps {
  /**
   * User name.
   */
  readonly name: string;

  /**
   * Avatar image URL.
   */
  readonly imageUrl?: string;

  /**
   * Avatar size.
   */
  readonly size?: UserAvatarSize;
}

/**
 * Returns size classes.
 *
 * @param size Avatar size.
 * @returns CSS classes.
 */
function getSizeClass(
  size: UserAvatarSize,
): string {
  switch (size) {
    case "sm":
      return "h-8 w-8 text-sm";

    case "lg":
      return "h-14 w-14 text-xl";

    case "xl":
      return "h-20 w-20 text-3xl";

    default:
      return "h-10 w-10 text-base";
  }
}

/**
 * Returns user initials.
 *
 * @param name User name.
 * @returns Initials.
 */
function getInitials(
  name: string,
): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (part) =>
        part.charAt(0).toUpperCase(),
    )
    .join("");
}

/**
 * User avatar.
 *
 * @param props Component properties.
 * @returns User avatar component.
 */
export function UserAvatar({
  name,
  imageUrl,
  size = "md",
}: UserAvatarProps): React.JSX.Element {
  const sizeClass =
    getSizeClass(size);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={[
          sizeClass,
          "rounded-full object-cover border border-slate-200",
        ].join(" ")}
      />
    );
  }

  return (
    <div
      className={[
        sizeClass,
        "flex items-center justify-center rounded-full bg-blue-600 font-semibold text-white",
      ].join(" ")}
    >
      {name.trim() ? (
        getInitials(name)
      ) : (
        <User size={18} />
      )}
    </div>
  );
}