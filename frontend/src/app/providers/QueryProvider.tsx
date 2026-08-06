/**
 * Query provider for the application.
 *
 * Provides the global TanStack Query client used for
 * server-state management throughout the application.
 */

import type { PropsWithChildren } from "react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Query provider component.
 *
 * @param props Provider props.
 * @returns Wrapped application.
 */
export function QueryProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}