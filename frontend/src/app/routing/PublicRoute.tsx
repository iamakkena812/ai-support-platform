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
 * @param props Route props.
 * @returns Public page or redirect.
 */
export function PublicRoute({
  children,
}: PublicRouteProps): React.JSX.Element {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate replace to={PROTECTED_ROUTES.DASHBOARD} />;
  }

  return <>{children}</>;
}