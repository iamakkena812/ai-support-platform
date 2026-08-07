/**
 * Customers query hook.
 *
 * Provides customer list data
 * using React Query.
 */

import {
  useQuery,
} from "@tanstack/react-query";

import {
  customerService,
} from "../services/customer.service";

import type {
  CustomerQueryFilters,
} from "../types/customer.types";

/**
 * Customer query keys.
 */
export const customerKeys = {
  /**
   * Root key.
   */
  all: [
    "customers",
  ] as const,

  /**
   * Customer lists.
   */
  lists: () =>
    [
      ...customerKeys.all,
      "list",
    ] as const,

  /**
   * Filtered customer list.
   */
  list: (
    filters?: CustomerQueryFilters,
  ) =>
    [
      ...customerKeys.lists(),
      filters,
    ] as const,

  /**
   * Customer details.
   */
  details: () =>
    [
      ...customerKeys.all,
      "detail",
    ] as const,

  /**
   * Customer detail.
   */
  detail: (
    id: string,
  ) =>
    [
      ...customerKeys.details(),
      id,
    ] as const,
};

/**
 * Use customers hook options.
 */
export interface UseCustomersOptions {
  /**
   * Customer filters.
   */
  readonly filters?: CustomerQueryFilters;

  /**
   * Enable query.
   */
  readonly enabled?: boolean;
}

/**
 * Customers query hook.
 *
 * @param options Hook options.
 * @returns Customer query result.
 */
export function useCustomers(
  options: UseCustomersOptions = {},
) {
  const {
    filters,
    enabled = true,
  } = options;

  return useQuery({
    queryKey:
      customerKeys.list(
        filters,
      ),

    queryFn: () =>
      customerService.getCustomers(
        filters,
      ),

    enabled,
  });
}