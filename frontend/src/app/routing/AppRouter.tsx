/**
 * Application router.
 */

import {
  Suspense,
} from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

import {
  DashboardPage,
  ForgotPasswordPage,
  LoginPage,
  ResetPasswordPage,
} from "./lazy-routes";

import {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
} from "./route-config";

/**
 * Application router.
 *
 * @returns Application routes.
 */
export function AppRouter(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <Routes>
        {/* Public */}

        <Route
          path={PUBLIC_ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path={
            PUBLIC_ROUTES.FORGOT_PASSWORD
          }
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path={
            PUBLIC_ROUTES.RESET_PASSWORD
          }
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* Protected */}

        <Route
          path={
            PROTECTED_ROUTES.DASHBOARD
          }
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect */}

        <Route
          path="*"
          element={
            <Navigate
              replace
              to={
                PUBLIC_ROUTES.LOGIN
              }
            />
          }
        />
      </Routes>
    </Suspense>
  );
}