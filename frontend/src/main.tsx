/**
 * Application entry point.
 */

import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import "./styles/index.css";

import { AppProviders } from "./app/providers/AppProviders";

/**
 * Root application.
 */
const container =
  document.getElementById(
    "root",
  );

if (
  container == null
) {
  throw new Error(
    "Root element not found.",
  );
}

createRoot(
  container,
).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
);