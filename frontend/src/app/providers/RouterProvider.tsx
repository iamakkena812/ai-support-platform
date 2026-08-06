/**
 * Router provider.
 *
 * Provides the BrowserRouter context for the application.
 */

import type { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";

/**
 * Router provider component.
 *
 * @param props Provider props.
 * @returns Wrapped application.
 */
export function RouterProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  return <BrowserRouter>{children}</BrowserRouter>;
}