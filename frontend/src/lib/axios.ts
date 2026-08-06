/**
 * Axios instance for the application.
 *
 * Creates the shared HTTP client used throughout
 * the frontend.
 */

import axios from "axios";

/**
 * Shared Axios instance.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});