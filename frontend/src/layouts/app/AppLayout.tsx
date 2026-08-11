/**
 * Application layout.
 *
 * Main layout used for authenticated pages.
 */

import type { PropsWithChildren } from "react";

import { Footer } from "../common/Footer";
import { Header } from "../common/Header";
import { Sidebar } from "../common/Sidebar";

/**
 * Application layout.
 *
 * @param props Layout properties.
 * @returns Application layout.
 */
export function AppLayout({
  children,
}: PropsWithChildren): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}