/**
 * Authentication interceptors.
 *
 * Registers request and response interceptors for
 * the shared Axios client.
 */

import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { apiClient } from "../axios/client";

/**
 * Request interceptor.
 *
 * @param config Axios request configuration.
 * @returns Updated request configuration.
 */
function onRequest(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  return config;
}

/**
 * Request error interceptor.
 *
 * @param error Axios error.
 * @returns Rejected promise.
 */
function onRequestError(
  error: AxiosError,
): Promise<never> {
  return Promise.reject(error);
}

/**
 * Response interceptor.
 *
 * @param response Axios response.
 * @returns Axios response.
 */
function onResponse<T>(
  response: AxiosResponse<T>,
): AxiosResponse<T> {
  return response;
}

/**
 * Response error interceptor.
 *
 * @param error Axios error.
 * @returns Rejected promise.
 */
function onResponseError(
  error: AxiosError,
): Promise<never> {
  return Promise.reject(error);
}

/**
 * Registers authentication interceptors.
 */
export function registerAuthInterceptors(): void {
  apiClient.interceptors.request.use(
    onRequest,
    onRequestError,
  );

  apiClient.interceptors.response.use(
    onResponse,
    onResponseError,
  );
}