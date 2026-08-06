/**
 * Error boundary component.
 *
 * Catches rendering errors in the React component tree
 * and displays a fallback UI.
 */

import type { ErrorInfo, PropsWithChildren } from "react";
import { Component } from "react";

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  public constructor(props: PropsWithChildren) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(
    error: Error,
  ): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public override componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo,
  ): void {
    console.error("Application Error:", error);
    console.error(errorInfo);
  }

  public override render(): React.JSX.Element {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8">
          <div className="max-w-lg rounded-xl border bg-white p-8 text-center shadow">
            <h1 className="mb-4 text-3xl font-bold text-red-600">
              Something went wrong
            </h1>

            <p className="mb-6 text-slate-600">
              An unexpected error occurred while rendering this page.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-700"
            >
              Reload Application
            </button>

            {import.meta.env.DEV && this.state.error ? (
              <pre className="mt-6 overflow-auto rounded bg-slate-100 p-4 text-left text-xs text-red-600">
                {this.state.error.stack}
              </pre>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children as React.JSX.Element;
  }
}