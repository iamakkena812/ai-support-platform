/**
 * Customer API client.
 */

import { apiClient } from "../../../api/axios/client";

import type {
  CreateCustomerRequest,
  CustomerListResponse,
  CustomerResponse,
  UpdateCustomerRequest,
} from "../types/customer.types";

/**
 * Customer API.
 */
export class CustomerApi {
  /**
   * List customers.
   */
  public static async getCustomers(
    page = 1,
    size = 10,
  ): Promise<CustomerListResponse> {
    const response =
      await apiClient.get<CustomerListResponse>(
        "/customers",
        {
          params: {
            page,
            size,
          },
        },
      );

    return response.data;
  }

  /**
   * Get customer by identifier.
   */
  public static async getCustomer(
    customerId: string,
  ): Promise<CustomerResponse> {
    const response =
      await apiClient.get<CustomerResponse>(
        `/customers/${customerId}`,
      );

    return response.data;
  }

  /**
   * Create customer.
   */
  public static async createCustomer(
    payload: CreateCustomerRequest,
  ): Promise<CustomerResponse> {
    const response =
      await apiClient.post<CustomerResponse>(
        "/customers",
        payload,
      );

    return response.data;
  }

  /**
   * Update customer.
   */
  public static async updateCustomer(
    customerId: string,
    payload: UpdateCustomerRequest,
  ): Promise<CustomerResponse> {
    const response =
      await apiClient.put<CustomerResponse>(
        `/customers/${customerId}`,
        payload,
      );

    return response.data;
  }

  /**
   * Delete customer.
   */
  public static async deleteCustomer(
    customerId: string,
  ): Promise<void> {
    await apiClient.delete(
      `/customers/${customerId}`,
    );
  }
}