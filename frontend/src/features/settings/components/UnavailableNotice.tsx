/**
 * Shared "not available" notice for settings sections that have no
 * real backend support. Used instead of silently faking a save
 * action against an endpoint that does not exist.
 */

import type { FC } from "react";

/**
 * Component properties.
 */
export interface UnavailableNoticeProps {
  /**
   * Section heading.
   */
  readonly title: string;

  /**
   * Explanation of why the section is unavailable.
   */
  readonly reason: string;
}

/**
 * Unavailable settings section notice.
 *
 * @param props - Component properties.
 * @returns Notice component.
 */
export const UnavailableNotice: FC<UnavailableNoticeProps> = ({
  title,
  reason,
}) => (
  <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h2 className="mb-3 text-xl font-semibold text-gray-900">{title}</h2>

    <p className="rounded border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
      {reason}
    </p>
  </section>
);
