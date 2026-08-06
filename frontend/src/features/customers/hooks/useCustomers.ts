/**
 * Customer list hook.
 */

import { useQuery } from "@tanstack/react-query";

import { CustomerService } from "../services/customer.service";

import type {
  CustomerListResponse,
} from "../types/customer.types";

/**
 * Customer query keys.
 */
export const customerQueryKeys = {
  /**
   * Customer query root.
   */
  all: ["customers"] as const,

  /**
   * Customer list query.
   */
  lists: () =>
    [...customerQueryKeys.all, "list"] as const,

  /**
   * Paginated customer list query.
   */
  list: (
    page: number,
    size: number,
  ) =>
    [
      ...customerQueryKeys.lists(),
      page,
      size,
    ] as const,
};

/**
 * Returns a paginated customer list.
 */
export function useCustomers(
  page = 1,
  size = 10,
) {
  return useQuery<CustomerListResponse>({
    queryKey:
      customerQueryKeys.list(
        page,
        size,
      ),

    queryFn: () =>
      CustomerService.getCustomers(
        page,
        size,
      ),

    staleTime: 1000 * 60 * 5,
  });
}