/**
 * Customer service.
 *
 * Contains customer business operations
 * and API communication abstraction.
 */

import {
  customerApi,
} from "../api/customer.api";

import {
  customerListResponseSchema,
  customerSchema,
} from "../schemas/customer.schema";

import type {
  CreateCustomerPayload,
  Customer,
  CustomerQueryFilters,
  CustomerListResponse,
  UpdateCustomerPayload,
} from "../types/customer.types";

/**
 * Customer service class.
 */
export class CustomerService {
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
      await customerApi.getCustomers(
        filters,
      );

    return customerListResponseSchema.parse(
      response,
    );
  }

  /**
   * Get customer by identifier.
   *
   * @param id Customer identifier.
   * @returns Customer.
   */
  async getCustomer(
    id: string,
  ): Promise<Customer> {
    const response =
      await customerApi.getCustomer(
        id,
      );

    return customerSchema.parse(
      response,
    );
  }

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
      await customerApi.createCustomer(
        payload,
      );

    return customerSchema.parse(
      response,
    );
  }

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
      await customerApi.updateCustomer(
        id,
        payload,
      );

    return customerSchema.parse(
      response,
    );
  }

  /**
   * Delete customer.
   *
   * @param id Customer identifier.
   */
  async deleteCustomer(
    id: string,
  ): Promise<void> {
    return customerApi.deleteCustomer(
      id,
    );
  }
}

/**
 * Customer service instance.
 */
export const customerService =
  new CustomerService();
