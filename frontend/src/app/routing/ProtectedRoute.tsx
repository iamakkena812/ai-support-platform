/**
 * Protected route component.
 *
 * Restricts unauthenticated users from accessing
 * protected application routes.
 */

import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../providers/auth/useAuth";
import { PUBLIC_ROUTES } from "./route-config";

/**
 * Protected route properties.
 */
interface ProtectedRouteProps {
  /**
   * Protected route content.
   */
  readonly children: ReactNode;
}

/**
 * Protects application routes from unauthenticated access.
 *
 * @param props - Protected route properties.
 * @returns Protected content or login redirect.
 */
export function ProtectedRoute({
  children,
}: ProtectedRouteProps): React.JSX.Element {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div
        className="flex min-h-[200px] items-center justify-center"
        role="status"
        aria-live="polite"
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to={PUBLIC_ROUTES.LOGIN}
      />
    );
  }

  return <>{children}</>;
}