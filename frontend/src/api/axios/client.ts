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
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000/api/v1";

/**
 * Shared Axios API client.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
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