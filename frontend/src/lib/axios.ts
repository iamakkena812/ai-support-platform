/**
 * Shared Axios client.
 *
 * Creates the application's shared HTTP client.
 */

import axios from "axios";

import { tokenService } from "../auth/services/token.service";

/**
 * Shared Axios instance.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(
    import.meta.env.VITE_API_TIMEOUT ?? 30000,
  ),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Attach access token.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token =
      tokenService.getAccessToken();

    if (
      token != null &&
      token.length > 0
    ) {
      config.headers.set(
        "Authorization",
        `Bearer ${token}`,
      );
    }

    return config;
  },
);

/**
 * Handle authentication failures.
 */
/**
 * Handle authentication failures.
 */
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const requestUrl =
      error.config?.url ?? "";

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !requestUrl.includes("/auth/login") &&
      !requestUrl.includes("/auth/profile")
    ) {
      tokenService.clearTokens();

      if (
        !window.location.pathname.startsWith(
          "/login",
        )
      ) {
        window.location.replace(
          "/login",
        );
      }
    }

    return Promise.reject(error);
  },
);