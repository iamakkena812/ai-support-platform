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
 */
export function AppLayout({
  children,
}: PropsWithChildren): React.JSX.Element {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}