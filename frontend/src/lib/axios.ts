/**
 * Shared Axios client.
 *
 * Creates the application's shared HTTP client used
 * by all API services.
 *
 * Configuration is loaded from Vite environment variables.
 */

import axios from "axios";

/**
 * Shared Axios instance.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(
    import.meta.env.VITE_API_TIMEOUT ?? 30000,
  ),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});