/**
 * Dashboard layout.
 *
 * Layout wrapper for authenticated dashboard pages.
 */

import type { PropsWithChildren } from "react";

import { AppLayout } from "./AppLayout";

/**
 * Dashboard layout.
 */
export function DashboardLayout({
  children,
}: PropsWithChildren): React.JSX.Element {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}