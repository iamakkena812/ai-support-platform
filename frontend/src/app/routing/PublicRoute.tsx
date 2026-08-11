/**
 * Public route component.
 *
 * Restricts authenticated users from accessing
 * public authentication pages.
 */

import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../providers/auth/useAuth";
import { PROTECTED_ROUTES } from "./route-config";

interface PublicRouteProps {
  /**
   * Child elements.
   */
  readonly children: ReactNode;
}

/**
 * Public route wrapper.
 *
 * @param props Route properties.
 * @returns Public page or redirect.
 */
export function PublicRoute({
  children,
}: PublicRouteProps): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={PROTECTED_ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}