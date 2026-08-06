/**
 * Authentication layout.
 *
 * Layout used for authentication pages.
 */

import type { PropsWithChildren } from "react";

/**
 * Authentication layout.
 */
export function AuthLayout({
  children,
}: PropsWithChildren): React.JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        {children}
      </div>
    </main>
  );
}