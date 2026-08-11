/**
 * Axios API client.
 *
 * Provides the configured HTTP client used by the frontend
 * to communicate with the backend API.
 */

import axios from "axios";

import { tokenService } from "../../auth/services/token.service";

/**
 * Backend API base URL.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not configured. Check the frontend environment file.",
  );
}

/**
 * Shared Axios API client.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 30000),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Attach the access token to authenticated requests.
 */
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

/**
 * Clear authentication state and redirect to login on an
 * unauthenticated response, except for the auth endpoints
 * themselves where a 401 is an expected credential failure.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const requestUrl: string = axios.isAxiosError(error)
      ? (error.config?.url ?? "")
      : "";

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !requestUrl.includes("/auth/login") &&
      !requestUrl.includes("/auth/profile")
    ) {
      tokenService.clearTokens();

      if (!window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);
