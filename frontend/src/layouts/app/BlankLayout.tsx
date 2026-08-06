/**
 * Blank layout.
 *
 * Minimal layout without navigation.
 */

import type { PropsWithChildren } from "react";

/**
 * Blank layout.
 */
export function BlankLayout({
  children,
}: PropsWithChildren): React.JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50">
      {children}
    </main>
  );
}