/**
 * Login page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "../services/auth.service";

/**
 * Login page.
 *
 * @returns Login page component.
 */
export function LoginPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * Handles login.
   *
   * @param event - Form submit event.
   */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      await authService.login({
        email,
        password,
      });

      navigate(
        "/dashboard",
        {
          replace: true,
        },
      );
        } catch (error) {
            console.error("Login failed:", error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Login failed.");
            }
        }
    }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Enterprise AI Support Platform
        </h1>

        <p className="mb-8 text-center text-gray-600">
          Sign in to continue.
        </p>

        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(
                  event.target.value,
                );
              }}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value,
                );
              }}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          {error ? (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}