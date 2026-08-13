/**
 * Customer API module.
 *
 * Handles customer HTTP requests.
 */

import {
  apiClient,
} from "../../../api/axios/client";

import type {
  CreateCustomerPayload,
  Customer,
  CustomerQueryFilters,
  CustomerListResponse,
  UpdateCustomerPayload,
} from "../types/customer.types";

/**
 * Customer API endpoint.
 */
const CUSTOMER_ENDPOINT = "/customers";

/**
 * Customer API object.
 */
export const customerApi = {
  /**
   * Get customers.
   *
   * @param filters Customer filters.
   * @returns Customer list response.
   */
  async getCustomers(
    filters?: CustomerQueryFilters,
  ): Promise<CustomerListResponse> {
    const response =
      await apiClient.get<CustomerListResponse>(
        CUSTOMER_ENDPOINT,
        {
          params: {
            page: filters?.page,
            pageSize: filters?.pageSize,
          },
        },
      );

    return response.data;
  },

  /**
   * Get customer by id.
   *
   * @param id Customer identifier.
   * @returns Customer.
   */
  async getCustomer(
    id: string,
  ): Promise<Customer> {
    const response =
      await apiClient.get<Customer>(
        `${CUSTOMER_ENDPOINT}/${id}`,
      );

    return response.data;
  },

  /**
   * Create customer.
   *
   * @param payload Customer payload.
   * @returns Created customer.
   */
  async createCustomer(
    payload: CreateCustomerPayload,
  ): Promise<Customer> {
    const response =
      await apiClient.post<Customer>(
        CUSTOMER_ENDPOINT,
        payload,
      );

    return response.data;
  },

  /**
   * Update customer.
   *
   * @param id Customer identifier.
   * @param payload Update payload.
   * @returns Updated customer.
   */
  async updateCustomer(
    id: string,
    payload: UpdateCustomerPayload,
  ): Promise<Customer> {
    const response =
      await apiClient.patch<Customer>(
        `${CUSTOMER_ENDPOINT}/${id}`,
        payload,
      );

    return response.data;
  },

  /**
   * Delete customer.
   *
   * @param id Customer identifier.
   */
  async deleteCustomer(
    id: string,
  ): Promise<void> {
    await apiClient.delete(
      `${CUSTOMER_ENDPOINT}/${id}`,
    );
  },
};
