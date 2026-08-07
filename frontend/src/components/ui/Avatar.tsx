/**
 * Avatar component.
 *
 * Displays a user avatar image or initials.
 */

import type {
  ImgHTMLAttributes,
} from "react";

/**
 * Avatar sizes.
 */
export type AvatarSize =
  | "sm"
  | "md"
  | "lg"
  | "xl";

/**
 * Component properties.
 */
export interface AvatarProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "size"
  > {
  /**
   * User display name.
   */
  readonly name: string;

  /**
   * Avatar image URL.
   */
  readonly src?: string;

  /**
   * Avatar size.
   */
  readonly size?: AvatarSize;
}

/**
 * Returns avatar size classes.
 *
 * @param size Avatar size.
 * @returns CSS classes.
 */
function getSizeClasses(
  size: AvatarSize,
): string {
  switch (size) {
    case "sm":
      return "h-8 w-8 text-xs";

    case "lg":
      return "h-14 w-14 text-lg";

    case "xl":
      return "h-20 w-20 text-xl";

    case "md":
    default:
      return "h-10 w-10 text-sm";
  }
}

/**
 * Returns user initials.
 *
 * @param name User name.
 * @returns User initials.
 */
function getInitials(
  name: string,
): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");
}

/**
 * Avatar component.
 *
 * @param props Component properties.
 * @returns Avatar component.
 */
export function Avatar({
  name,
  src,
  size = "md",
  alt,
  className = "",
  ...props
}: AvatarProps): React.JSX.Element {
  const sizeClasses =
    getSizeClasses(size);

  if (
    src != null &&
    src.length > 0
  ) {
    return (
      <img
        src={src}
        alt={alt ?? name}
        className={[
          "rounded-full object-cover",
          sizeClasses,
          className,
        ].join(" ")}
        {...props}
      />
    );
  }

  return (
    <div
      className={[
        "flex items-center justify-center rounded-full bg-blue-600 font-semibold text-white",
        sizeClasses,
        className,
      ].join(" ")}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}