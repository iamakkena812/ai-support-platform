/**
 * Application providers.
 *
 * Composes all global providers required by the application.
 */

import { AppRouter } from "../routing/AppRouter";
import { ThemeProvider } from "../providers/theme";

import { AuthProvider } from "./auth/AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { RouterProvider } from "./RouterProvider";

/**
 * Root application providers.
 *
 * @returns Wrapped application.
 */
export function AppProviders(): React.JSX.Element {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <RouterProvider>
            <AppRouter />
          </RouterProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}