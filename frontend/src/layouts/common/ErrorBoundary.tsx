/**
 * Error boundary component.
 *
 * Catches rendering errors in the React component tree
 * and displays a fallback user interface.
 */

import type {
  ErrorInfo,
  PropsWithChildren,
} from "react";

import { Component } from "react";

interface ErrorBoundaryState {
  /**
   * Indicates whether an error occurred.
   */
  readonly hasError: boolean;

  /**
   * Captured error.
   */
  readonly error: Error | null;
}

/**
 * Application error boundary.
 */
export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  /**
   * Creates an error boundary.
   *
   * @param props Component properties.
   */
  public constructor(
    props: PropsWithChildren,
  ) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Updates the component state after an error.
   *
   * @param error Rendering error.
   * @returns Updated state.
   */
  public static getDerivedStateFromError(
    error: Error,
  ): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Logs rendering errors.
   *
   * @param error Rendering error.
   * @param errorInfo Component stack.
   */
  public override componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo,
  ): void {
    console.error(
      "Application Error:",
      error,
    );

    console.error(
      "Component Stack:",
      errorInfo,
    );

    // TODO:
    // Send errors to Sentry,
    // OpenTelemetry or another
    // monitoring platform.
  }

  /**
   * Renders the application.
   *
   * @returns Component tree.
   */
  public override render(): React.JSX.Element {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
          <div className="w-full max-w-2xl rounded-xl bg-white p-10 shadow-lg">
            <h1 className="text-3xl font-bold text-red-600">
              Something went wrong
            </h1>

            <p className="mt-4 text-slate-600">
              An unexpected error occurred while
              rendering this page.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="rounded-lg bg-slate-900 px-5 py-2 font-medium text-white transition hover:bg-slate-700"
              >
                Reload Application
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "/dashboard";
                }}
                className="rounded-lg border border-slate-300 px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Go to Dashboard
              </button>
            </div>

            {import.meta.env.DEV &&
            this.state.error ? (
              <div className="mt-8">
                <h2 className="mb-2 text-sm font-semibold text-slate-700">
                  Development Stack Trace
                </h2>

                <pre className="overflow-auto rounded-lg bg-slate-100 p-4 text-xs text-red-600">
                  {this.state.error.stack}
                </pre>
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props
      .children as React.JSX.Element;
  }
}