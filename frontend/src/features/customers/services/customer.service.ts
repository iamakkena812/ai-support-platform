/**
 * Customer service.
 *
 * Contains business logic for customer operations.
 */

import { CustomerApi } from "../api/customer.api";

import {
  customerListResponseSchema,
  customerResponseSchema,
} from "../schemas/customer.schema";

import type {
  CreateCustomerRequest,
  CustomerListResponse,
  CustomerResponse,
  UpdateCustomerRequest,
} from "../types/customer.types";

/**
 * Customer service.
 */
export class CustomerService {
  /**
   * List customers.
   */
  public static async getCustomers(
    page = 1,
    size = 10,
  ): Promise<CustomerListResponse> {
    const response =
      await CustomerApi.getCustomers(
        page,
        size,
      );

    return customerListResponseSchema.parse(
      response,
    ) as CustomerListResponse;
  }

  /**
   * Get customer.
   */
  public static async getCustomer(
    customerId: string,
  ): Promise<CustomerResponse> {
    const response =
      await CustomerApi.getCustomer(
        customerId,
      );

    return customerResponseSchema.parse(
      response,
    ) as CustomerResponse;
  }

  /**
   * Create customer.
   */
  public static async createCustomer(
    payload: CreateCustomerRequest,
  ): Promise<CustomerResponse> {
    const response =
      await CustomerApi.createCustomer(
        payload,
      );

    return customerResponseSchema.parse(
      response,
    ) as CustomerResponse;
  }

  /**
   * Update customer.
   */
  public static async updateCustomer(
    customerId: string,
    payload: UpdateCustomerRequest,
  ): Promise<CustomerResponse> {
    const response =
      await CustomerApi.updateCustomer(
        customerId,
        payload,
      );

    return customerResponseSchema.parse(
      response,
    ) as CustomerResponse;
  }

  /**
   * Delete customer.
   */
  public static async deleteCustomer(
    customerId: string,
  ): Promise<void> {
    await CustomerApi.deleteCustomer(
      customerId,
    );
  }
}