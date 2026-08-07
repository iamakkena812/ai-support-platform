/**
 * Customer service.
 *
 * Contains customer business operations
 * and API communication abstraction.
 */

import {
  customerApi,
} from "../api/customer.api";

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
    return customerApi.getCustomers(
      filters,
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
    return customerApi.getCustomer(
      id,
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
    return customerApi.createCustomer(
      payload,
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
    return customerApi.updateCustomer(
      id,
      payload,
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