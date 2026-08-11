/**
 * Footer component.
 *
 * Displays the application footer.
 */

/**
 * Footer component.
 *
 * @returns Footer component.
 */
export function Footer(): React.JSX.Element {
  return (
    <footer className="flex min-h-12 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-4 text-xs text-slate-500 sm:px-6">
      <span>Version 1.0.0</span>

      <a
        href="https://github.com/techakkena/ai-support-platform"
        target="_blank"
        rel="noreferrer"
        className="transition-colors hover:text-slate-900"
      >
        GitHub Repository
      </a>
    </footer>
  );
}
