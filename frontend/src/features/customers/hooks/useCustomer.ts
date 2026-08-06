/**
 * Customer hook.
 */

import { useQuery } from "@tanstack/react-query";

import { CustomerService } from "../services/customer.service";

import { customerQueryKeys } from "./useCustomers";

import type {
  CustomerResponse,
} from "../types/customer.types";

/**
 * Returns a customer by identifier.
 */
export function useCustomer(
  customerId: string,
) {
  return useQuery<CustomerResponse>({
    queryKey: [
      ...customerQueryKeys.all,
      customerId,
    ],

    queryFn: () =>
      CustomerService.getCustomer(
        customerId,
      ),

    enabled:
      customerId.length > 0,

    staleTime:
      1000 * 60 * 5,
  });
}