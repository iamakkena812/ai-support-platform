/**
 * Customer detail query hook.
 *
 * Provides a single customer
 * using React Query.
 */

import {
  useQuery,
} from "@tanstack/react-query";

import {
  customerService,
} from "../services/customer.service";

import {
  customerKeys,
} from "./useCustomers";

/**
 * Use customer options.
 */
export interface UseCustomerOptions {
  /**
   * Customer identifier.
   */
  readonly id: string;

  /**
   * Enable query.
   */
  readonly enabled?: boolean;
}

/**
 * Customer detail hook.
 *
 * @param options Hook options.
 * @returns Customer query result.
 */
export function useCustomer(
  options: UseCustomerOptions,
) {
  const {
    id,
    enabled = true,
  } = options;

  return useQuery({
    queryKey:
      customerKeys.detail(
        id,
      ),

    queryFn: () =>
      customerService.getCustomer(
        id,
      ),

    enabled:
      enabled &&
      Boolean(id),
  });
}