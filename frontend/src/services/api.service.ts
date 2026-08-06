/**
 * Base API service.
 *
 * Provides common HTTP methods for communicating
 * with the backend API.
 */

import type {
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

import { apiClient } from "../api/axios/client";

/**
 * Base API service.
 */
export class ApiService {
  /**
   * Sends a GET request.
   *
   * @param url Endpoint URL.
   * @param config Optional request configuration.
   * @returns Response payload.
   */
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> =
      await apiClient.get(url, config);

    return response.data;
  }

  /**
   * Sends a POST request.
   *
   * @param url Endpoint URL.
   * @param data Request payload.
   * @param config Optional request configuration.
   * @returns Response payload.
   */
  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> =
      await apiClient.post(url, data, config);

    return response.data;
  }

  /**
   * Sends a PUT request.
   *
   * @param url Endpoint URL.
   * @param data Request payload.
   * @param config Optional request configuration.
   * @returns Response payload.
   */
  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> =
      await apiClient.put(url, data, config);

    return response.data;
  }

  /**
   * Sends a PATCH request.
   *
   * @param url Endpoint URL.
   * @param data Request payload.
   * @param config Optional request configuration.
   * @returns Response payload.
   */
  async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> =
      await apiClient.patch(url, data, config);

    return response.data;
  }

  /**
   * Sends a DELETE request.
   *
   * @param url Endpoint URL.
   * @param config Optional request configuration.
   * @returns Response payload.
   */
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> =
      await apiClient.delete(url, config);

    return response.data;
  }
}

/**
 * Shared API service instance.
 */
export const apiService = new ApiService();