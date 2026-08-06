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

interface ProtectedRouteProps {
  readonly children: ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps): React.JSX.Element {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <>Loading...</>;
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