/**
 * Blank layout.
 *
 * Minimal layout without navigation.
 */

import type { PropsWithChildren } from "react";

/**
 * Blank layout.
 *
 * @param props Layout properties.
 * @returns Blank layout.
 */
export function BlankLayout({
  children,
}: PropsWithChildren): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}